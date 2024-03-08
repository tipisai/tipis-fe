import Icon, { StarOutlined } from "@ant-design/icons"
import { App, Button, Segmented } from "antd"
import { AnimatePresence, motion } from "framer-motion"
import { FC, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Controller, useForm, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { v4 } from "uuid"
import { Avatar } from "@illa-public/avatar"
import { CodeEditor } from "@illa-public/code-editor"
import {
  CloseIcon,
  ForkIcon,
  PlayFillIcon,
  PreviousIcon,
  ResetIcon,
  ShareIcon,
  StarFillIcon,
} from "@illa-public/icon"
import IconHotSpot from "@illa-public/icon-hot-spot"
import { ShareAgentPC } from "@illa-public/invite-modal"
import {
  getAIAgentMarketplaceInfo,
  getLLM,
  isPremiumModel,
} from "@illa-public/market-agent"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  AI_AGENT_TYPE,
  Agent,
  MarketAIAgent,
  MemberInfo,
  USER_ROLE,
  USER_STATUS,
} from "@illa-public/public-types"
import { RecordEditor } from "@illa-public/record-editor"
import { useUpgradeModal } from "@illa-public/upgrade-modal"
import {
  getCurrentTeamInfo,
  getCurrentUser,
  getPlanUtils,
  teamActions,
} from "@illa-public/user-data"
import {
  ACTION_MANAGE,
  ATTRIBUTE_GROUP,
  canManage,
  canManageInvite,
  canUseUpgradeFeature,
  openShareAgentModal,
  showShareAgentModal,
  showShareAgentModalOnlyForShare,
} from "@illa-public/user-role-utils"
import {
  formatNumForAgent,
  getAgentPublicLink,
  getAuthToken,
  getILLABuilderURL,
  getILLACloudURL,
} from "@illa-public/utils"
import { TextSignal } from "@/api/ws/textSignal"
import AIAgentBlock from "@/page/AI/components/AIAgentBlock"
import { PreviewChat } from "@/page/AI/components/PreviewChat"
import {
  ChatSendRequestPayload,
  CollaboratorsInfo,
} from "@/page/AI/components/PreviewChat/interface"
import { useAgentConnect } from "@/page/AI/components/ws/useAgentConnect"
import { useForkAIAgentToTeamMutation } from "@/redux/services/agentAPI"
import {
  useStarAIAgentMutation,
  useUnstarAIAgentMutation,
} from "@/redux/services/marketAPI"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { track } from "@/utils/mixpanelHelper"
import { ChatContext } from "../../components/ChatContext"
import { IAIAgentRunProps } from "../interface"
import {
  agentAvatarStyle,
  agentControlContainerStyle,
  agentDescStyle,
  agentMenuContainerStyle,
  agentNicknameStyle,
  agentTeamAvatarStyle,
  agentTeamInfoContainerStyle,
  agentTeamNameStyle,
  agentTitleContainerStyle,
  agentTopContainerStyle,
  aiAgentContainerStyle,
  backMenuStyle,
  backTextStyle,
  buttonContainerStyle,
  closeIconStyle,
  labelLogoStyle,
  labelStyle,
  leftPanelContainerStyle,
  readOnlyTextStyle,
  rightPanelContainerStyle,
} from "./style"

export const AIAgentRunPC: FC<IAIAgentRunProps> = (props) => {
  const { agent, marketplace } = props

  const navigate = useNavigate()

  const [currentMarketplaceInfo, setCurrentMarketplaceInfo] = useState<
    MarketAIAgent | undefined
  >(marketplace)

  const [forkAIAgentToTeam] = useForkAIAgentToTeamMutation()
  const [starAIAgent] = useStarAIAgentMutation()
  const [unstarAIAgent] = useUnstarAIAgentMutation()

  const { control, handleSubmit, getValues, reset } = useForm<Agent>({
    mode: "onSubmit",
    defaultValues: agent,
  })

  const { isDirty, isValid } = useFormState({
    control,
  })

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!!
  const currentUserInfo = useSelector(getCurrentUser)

  const { message: messageAPI } = App.useApp()

  // page state
  const [isRunning, setIsRunning] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [shareDialogVisible, setShareDialogVisible] = useState(false)
  const [starLoading, setStarLoading] = useState(false)
  const [forkLoading, setForkLoading] = useState(false)
  const [starState, setStarState] = useState(
    currentMarketplaceInfo?.marketplace?.isStarredByCurrentUser ?? false,
  )

  // data state
  const [inRoomUsers, setInRoomUsers] = useState<CollaboratorsInfo[]>([])
  const [isReceiving, setIsReceiving] = useState(false)
  const [starNum, setStarNum] = useState(
    currentMarketplaceInfo?.marketplace.numStars ?? 0,
  )
  const upgradeModal = useUpgradeModal()

  const { ownerTeamIdentifier, agentID } = useParams()
  const [searchParams] = useSearchParams()

  // premium dialog
  const canUseBillingFeature = canUseUpgradeFeature(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicensePurchased,
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  // ui state
  const canShowInviteButton = showShareAgentModal(
    currentTeamInfo,
    agent.teamID === currentTeamInfo.id
      ? currentTeamInfo.myRole
      : USER_ROLE.GUEST,
    getValues("publishedToMarketplace"),
  )

  const [showEditPanel, setShowEditPanel] = useState(true)

  const { t } = useTranslation()

  const dispatch = useDispatch()

  const handleCloseEditPanel = () => {
    setShowEditPanel(false)
  }

  const handleClickBack = () => {
    const cloud_url = getILLACloudURL(window.customDomain)
    if (document.referrer.includes(cloud_url)) {
      return (location.href = `${cloud_url}/workspace/${ownerTeamIdentifier}/ai-agents`)
    }
    if (
      document.referrer.includes(import.meta.env.ILLA_MARKET_URL) &&
      agentID
    ) {
      return (location.href = `${
        import.meta.env.ILLA_MARKET_URL
      }/ai-agent/${agentID}/detail`)
    }
    return (location.href = cloud_url)
  }

  const handleSubmitClick = handleSubmit(async (data) => {
    if (isPremiumModel(data.model) && !canUseBillingFeature) {
      upgradeModal({
        modalType: "agent",
        from: "agent_run_gpt4",
      })
      return
    }
    reset(data)
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
      {
        element: isRunning ? "restart" : "start",
        parameter1: data.agentType === 1 ? "chat" : "text",
        parameter5: agent.aiAgentID,
      },
    )
    isRunning
      ? await reconnect(data.aiAgentID, data.agentType)
      : await connect(data.aiAgentID, data.agentType)
  })

  const dialog = (
    <Controller
      control={control}
      name="publishedToMarketplace"
      render={({ field }) => (
        <MixpanelTrackProvider
          basicTrack={track}
          pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN}
        >
          {shareDialogVisible && (
            <ShareAgentPC
              itemID={agent.aiAgentID}
              onInvitedChange={(userList) => {
                const memberListInfo: MemberInfo[] = userList.map((user) => {
                  return {
                    ...user,
                    userID: "",
                    nickname: "",
                    avatar: "",
                    userStatus: USER_STATUS.PENDING,
                    permission: {},
                    createdAt: "",
                    updatedAt: "",
                  }
                })
                dispatch(teamActions.updateInvitedUserReducer(memberListInfo))
              }}
              canUseBillingFeature={canUseUpgradeFeature(
                currentTeamInfo.myRole,
                getPlanUtils(currentTeamInfo),
                currentTeamInfo.totalTeamLicense.teamLicensePurchased,
                currentTeamInfo.totalTeamLicense.teamLicenseAllPaid,
              )}
              title={t(
                "user_management.modal.social_media.default_text.agent",
                {
                  agentName: agent.name,
                },
              )}
              redirectURL={`${getILLABuilderURL(
                window.customDomain,
              )}/${ownerTeamIdentifier}/ai-agent/${
                agent.aiAgentID
              }/run?myTeamIdentifier=${searchParams.get("myTeamIdentifier")}`}
              onClose={() => {
                setShareDialogVisible(false)
              }}
              canInvite={canManageInvite(
                currentTeamInfo.myRole,
                currentTeamInfo.permission.allowEditorManageTeamMember,
                currentTeamInfo.permission.allowViewerManageTeamMember,
              )}
              defaultInviteUserRole={USER_ROLE.VIEWER}
              teamID={currentTeamInfo.id}
              currentUserRole={currentTeamInfo.myRole}
              defaultBalance={currentTeamInfo.currentTeamLicense.balance}
              defaultAllowInviteLink={
                currentTeamInfo.permission.inviteLinkEnabled
              }
              onInviteLinkStateChange={(enableInviteLink) => {
                dispatch(
                  teamActions.updateTeamMemberPermissionReducer({
                    teamID: currentTeamInfo.id,
                    newPermission: {
                      ...currentTeamInfo.permission,
                      inviteLinkEnabled: enableInviteLink,
                    },
                  }),
                )
              }}
              agentID={agent.aiAgentID}
              defaultAgentContributed={field.value}
              onAgentContributed={async (isAgentContributed) => {
                if (isAgentContributed) {
                  const resp = await getAIAgentMarketplaceInfo(agent.aiAgentID)
                  setCurrentMarketplaceInfo(resp.data)
                  const newUrl = new URL(
                    getAgentPublicLink(resp.data.aiAgent.aiAgentID),
                  )
                  newUrl.searchParams.set("token", getAuthToken())
                  window.open(newUrl, "_blank")
                } else {
                  setCurrentMarketplaceInfo(undefined)
                }
                field.onChange(isAgentContributed)
              }}
              onCopyInviteLink={(link: string) => {
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                  ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                  {
                    element: "share_modal_copy_team",
                    parameter5: agent.aiAgentID,
                  },
                )
                copyToClipboard(
                  t("user_management.modal.custom_copy_text_agent_invite", {
                    userName: currentUserInfo.nickname,
                    teamName: currentTeamInfo.name,
                    inviteLink: link,
                  }),
                )
              }}
              onCopyAgentMarketLink={(link: string) => {
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                  ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                  {
                    element: "share_modal_link",
                    parameter5: agent.aiAgentID,
                  },
                )
                copyToClipboard(
                  t("user_management.modal.contribute.default_text.agent", {
                    agentName: agent.name,
                    agentLink: link,
                  }),
                )
              }}
              userRoleForThisAgent={
                currentTeamInfo.id === agent.teamID
                  ? currentTeamInfo.myRole
                  : USER_ROLE.GUEST
              }
              ownerTeamID={agent.teamID}
              onBalanceChange={(balance) => {
                dispatch(
                  teamActions.updateTeamMemberSubscribeReducer({
                    teamID: currentTeamInfo.id,
                    subscribeInfo: {
                      ...currentTeamInfo.currentTeamLicense,
                      balance: balance,
                    },
                  }),
                )
              }}
              teamPlan={getPlanUtils(currentTeamInfo)}
              onShare={(platform) => {
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                  ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                  {
                    element: "share_modal_social_media",
                    parameter4: platform,
                    parameter5: agent.aiAgentID,
                  },
                )
              }}
            />
          )}
        </MixpanelTrackProvider>
      )}
    />
  )

  const {
    sendMessage,
    generationMessage,
    chatMessages,
    reconnect,
    connect,
    wsStatus,
  } = useAgentConnect({
    onSendClean: () => {
      sendMessage(
        {} as ChatSendRequestPayload,
        TextSignal.CLEAN,
        getValues("agentType"),
        "clean",
        false,
      )
    },
    onStartRunning: () => {},
    onConnecting: (isConnecting) => {
      setIsConnecting(isConnecting)
    },
    onReceiving: (isReceiving) => {
      setIsReceiving(isReceiving)
    },
    onRunning: (isRunning: boolean) => {
      setIsRunning(isRunning)
    },
    onSendPrompt(): void {
      sendMessage(
        {
          threadID: v4(),
          prompt: getValues("prompt"),
          variables: getValues("variables"),
          modelConfig: getValues("modelConfig"),
          model: getValues("model"),
          actionID: getValues("aiAgentID"),
          agentType: getValues("agentType"),
        } as ChatSendRequestPayload,
        TextSignal.RUN,
        getValues("agentType"),
        "chat",
        false,
      )
    },
    onUpdateRoomUsers(roomUsers: CollaboratorsInfo[]): void {
      setInRoomUsers(roomUsers)
    },
  })

  useEffect(() => {
    canShowInviteButton &&
      track(
        ILLA_MIXPANEL_EVENT_TYPE.SHOW,
        ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
        {
          element: "invite_entry",
        },
      )
  }, [canShowInviteButton])
  const menu = (
    <Controller
      control={control}
      name="publishedToMarketplace"
      render={({ field }) => (
        <div css={agentMenuContainerStyle}>
          {canShowInviteButton && (
            <Button
              icon={<Icon component={ShareIcon} />}
              onClick={() => {
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                  ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                  {
                    element: "invite_entry",
                    parameter5: agent.aiAgentID,
                  },
                )
                if (
                  !openShareAgentModal(
                    currentTeamInfo,
                    currentTeamInfo.id === agent.teamID
                      ? currentTeamInfo.myRole
                      : USER_ROLE.GUEST,
                    field.value,
                  )
                ) {
                  upgradeModal({
                    modalType: "upgrade",
                    from: "agent_run_share",
                  })
                  return
                }
                setShareDialogVisible(true)
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.SHOW,
                  ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                  {
                    element: "share_modal",
                    parameter5: agent.aiAgentID,
                  },
                )
              }}
            >
              {t("share")}
            </Button>
          )}
          {field.value && (
            <Button
              onClick={async () => {
                setStarLoading(true)
                track(
                  ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                  ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                  {
                    element: "star",
                    parameter5: agent.aiAgentID,
                  },
                )
                try {
                  if (starState) {
                    await unstarAIAgent(agent.aiAgentID).unwrap()
                    if (starNum > 0) {
                      setStarNum(starNum - 1)
                    }
                  } else {
                    await starAIAgent(agent.aiAgentID).unwrap()
                    setStarNum(starNum + 1)
                  }
                  setStarState(!starState)
                } catch (e) {
                  messageAPI.error({
                    content: t("dashboard.message.star-failed"),
                  })
                } finally {
                  setStarLoading(false)
                }
              }}
              loading={starLoading}
              icon={
                starState ? (
                  <Icon
                    component={StarFillIcon}
                    style={{
                      color: "#FFBB38",
                    }}
                  />
                ) : (
                  <StarOutlined />
                )
              }
            >
              <span>{t("marketplace.star")}</span>
              {starNum > 0 && <span> {formatNumForAgent(starNum)}</span>}
            </Button>
          )}
          {canManage(
            currentTeamInfo.myRole,
            ATTRIBUTE_GROUP.AI_AGENT,
            getPlanUtils(currentTeamInfo),
            ACTION_MANAGE.FORK_AI_AGENT,
          ) &&
            field.value && (
              <Button
                loading={forkLoading}
                icon={<Icon component={ForkIcon} />}
                onClick={async () => {
                  track(
                    ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                    ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                    {
                      element: "fork",
                      parameter5: agent.aiAgentID,
                    },
                  )
                  setForkLoading(true)
                  try {
                    const newAgent = await forkAIAgentToTeam({
                      teamID: currentTeamInfo.id,
                      aiAgentID: agent.aiAgentID,
                    }).unwrap()
                    navigate(
                      `/${currentTeamInfo.identifier}/ai-agent/${newAgent.aiAgentID}`,
                    )
                  } catch (e) {
                    messageAPI.error({
                      content: t("dashboard.message.fork-failed"),
                    })
                  } finally {
                    setForkLoading(false)
                  }
                }}
              >
                <span>{t("marketplace.fork")}</span>
                {(currentMarketplaceInfo?.marketplace.numForks ?? 0) > 0 && (
                  <span>
                    {" "}
                    {formatNumForAgent(
                      currentMarketplaceInfo?.marketplace.numForks ?? 0,
                    )}
                  </span>
                )}
              </Button>
            )}
        </div>
      )}
    />
  )

  return (
    <>
      <Helmet>
        <title>{agent.name}</title>
      </Helmet>
      <ChatContext.Provider value={{ inRoomUsers }}>
        <div css={aiAgentContainerStyle}>
          <AnimatePresence mode="wait" initial={false}>
            {showEditPanel && (
              <motion.div
                css={leftPanelContainerStyle}
                initial={{
                  opacity: 0,
                  x: "-100%",
                  position: "absolute",
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  position: "relative",
                  transition: { duration: 0.3 },
                }}
                exit={{
                  opacity: 0,
                  x: "-100%",
                  position: "absolute",
                }}
              >
                <div css={agentTopContainerStyle}>
                  <div css={backMenuStyle}>
                    <div onClick={handleClickBack}>
                      <Icon component={PreviousIcon} size={16} />

                      <div css={backTextStyle}>{t("back")}</div>
                    </div>
                    <IconHotSpot
                      onClick={handleCloseEditPanel}
                      css={closeIconStyle}
                    >
                      <Icon component={CloseIcon} size={12} />
                    </IconHotSpot>
                  </div>
                  <div css={agentTitleContainerStyle}>
                    <Controller
                      control={control}
                      name="icon"
                      render={({ field }) => (
                        <Avatar
                          css={agentAvatarStyle}
                          avatarUrl={field.value}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <div css={agentNicknameStyle}>{field.value}</div>
                      )}
                    />
                  </div>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <div css={agentDescStyle}>{field.value}</div>
                    )}
                  />
                  <div css={agentTeamInfoContainerStyle}>
                    <Controller
                      control={control}
                      name="teamIcon"
                      render={({ field }) => (
                        <Avatar
                          css={agentTeamAvatarStyle}
                          avatarUrl={field.value}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="teamName"
                      render={({ field }) => (
                        <div css={agentTeamNameStyle}>{field.value}</div>
                      )}
                    />
                  </div>
                  {menu}
                </div>
                <div css={agentControlContainerStyle}>
                  <Controller
                    name="agentType"
                    control={control}
                    shouldUnregister={false}
                    render={({ field }) => (
                      <AIAgentBlock
                        title={t("editor.ai-agent.label.mode")}
                        tips={t("editor.ai-agent.tips.mode")}
                      >
                        <Segmented
                          value={field.value}
                          block
                          type="button"
                          options={[
                            {
                              value: AI_AGENT_TYPE.CHAT,
                              label: t("editor.ai-agent.option.mode.chat"),
                            },
                            {
                              value: AI_AGENT_TYPE.TEXT_GENERATION,
                              label: t("editor.ai-agent.option.mode.text"),
                            },
                          ]}
                          onChange={(value) => {
                            if (isReceiving || isConnecting) {
                              messageAPI.info({
                                content: t(
                                  "editor.ai-agent.message.generating",
                                ),
                              })
                              return
                            }
                            track(
                              ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                              ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                              {
                                element: "mode_radio_button",
                                parameter1: value,
                                parameter5: agent.aiAgentID,
                              },
                            )
                            field.onChange(value)
                          }}
                        />
                      </AIAgentBlock>
                    )}
                  />
                  <Controller
                    name="prompt"
                    control={control}
                    shouldUnregister={false}
                    render={({ field: promptField }) => (
                      <Controller
                        name="variables"
                        control={control}
                        render={({ field: variables }) => (
                          <AIAgentBlock title={"Prompt"}>
                            <CodeEditor
                              {...promptField}
                              editable={false}
                              completionOptions={variables.value}
                            />
                          </AIAgentBlock>
                        )}
                      />
                    )}
                  />
                  <Controller
                    name="variables"
                    control={control}
                    rules={{
                      validate: (value) =>
                        value.every(
                          (param) => param.key !== "" && param.value !== "",
                        ) ||
                        (value.length === 1 &&
                          value[0].key === "" &&
                          value[0].value === ""),
                    }}
                    shouldUnregister={false}
                    render={({ field }) =>
                      field.value.length > 0 ? (
                        <AIAgentBlock
                          title={t("editor.ai-agent.label.variable")}
                        >
                          <RecordEditor
                            fillOnly
                            records={field.value}
                            onChangeKey={(index, key) => {
                              const newVariables = [...field.value]
                              newVariables[index].key = key
                              field.onChange(newVariables)
                            }}
                            onChangeValue={(index, _, value) => {
                              const newVariables = [...field.value]
                              newVariables[index].value = value
                              field.onChange(newVariables)
                            }}
                            onAdd={() => {}}
                            onDelete={() => {}}
                            label={""}
                          />
                        </AIAgentBlock>
                      ) : (
                        <></>
                      )
                    }
                  />
                  <Controller
                    name="model"
                    control={control}
                    render={({ field }) => (
                      <AIAgentBlock title={t("editor.ai-agent.label.model")}>
                        <div css={labelStyle}>
                          <span css={labelLogoStyle}>
                            {getLLM(field.value)?.logo}
                          </span>
                          <span css={readOnlyTextStyle}>
                            {getLLM(field.value)?.name}
                          </span>
                        </div>
                      </AIAgentBlock>
                    )}
                  />
                </div>
                <form onSubmit={handleSubmitClick}>
                  <div css={buttonContainerStyle}>
                    <Button
                      size="large"
                      disabled={!isValid}
                      loading={isConnecting}
                      icon={isRunning ? <ResetIcon /> : <PlayFillIcon />}
                      block
                      htmlType="submit"
                    >
                      {!isRunning
                        ? t("editor.ai-agent.start")
                        : t("editor.ai-agent.restart")}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          <Controller
            name="agentType"
            control={control}
            shouldUnregister={false}
            render={({ field }) => (
              <Controller
                control={control}
                name="publishedToMarketplace"
                render={({ field: contributedField }) => (
                  <div css={rightPanelContainerStyle}>
                    <PreviewChat
                      wsStatus={wsStatus}
                      showShareDialog={showShareAgentModalOnlyForShare(
                        currentTeamInfo,
                      )}
                      showContributeDialog={showShareAgentModal(
                        currentTeamInfo,
                        agent.teamID === currentTeamInfo.id
                          ? currentTeamInfo.myRole
                          : USER_ROLE.GUEST,
                        contributedField.value,
                      )}
                      showEditPanel={showEditPanel}
                      setShowEditPanel={setShowEditPanel}
                      isRunning={isRunning}
                      isConnecting={isConnecting}
                      hasCreated={true}
                      isMobile={false}
                      editState="RUN"
                      agentType={field.value}
                      model={getValues("model")}
                      chatMessages={chatMessages}
                      generationMessage={generationMessage}
                      isReceiving={isReceiving}
                      blockInput={!isRunning || isDirty}
                      onSendMessage={(message, agentType: AI_AGENT_TYPE) => {
                        track(
                          ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                          ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
                          {
                            element: "send",
                            parameter5: agent.aiAgentID,
                          },
                        )
                        sendMessage(
                          {
                            threadID: message.threadID,
                            prompt: message.message,
                            variables: [],
                            modelConfig: getValues("modelConfig"),
                            model: getValues("model"),
                            agentType: getValues("agentType"),
                            actionID: getValues("aiAgentID"),
                          } as ChatSendRequestPayload,
                          TextSignal.RUN,
                          agentType,
                          "chat",
                          true,
                          message,
                        )
                      }}
                      onCancelReceiving={() => {
                        sendMessage(
                          {} as ChatSendRequestPayload,
                          TextSignal.STOP_ALL,
                          field.value,
                          "stop_all",
                          false,
                        )
                        setIsReceiving(false)
                      }}
                      onClickStartRunning={handleSubmitClick}
                    />
                  </div>
                )}
              />
            )}
          />
        </div>
        {dialog}
      </ChatContext.Provider>
    </>
  )
}

export default AIAgentRunPC

AIAgentRunPC.displayName = "AIAgentRunPC"
