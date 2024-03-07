import Icon from "@ant-design/icons"
import { CodeEditor } from "@illa-public/code-editor"
import { getColor } from "@illa-public/color-scheme"
import { AvatarUpload } from "@illa-public/cropper"
import {
  DocsIcon,
  PlayFillIcon,
  PlusIcon,
  PreviousIcon,
  ResetIcon,
  UpgradeIcon,
} from "@illa-public/icon"
import {
  ContributeAgentPC,
  HASHTAG_REQUEST_TYPE,
  ShareAgentPC,
  ShareAgentTab,
} from "@illa-public/invite-modal"
import {
  freeModelList,
  isPremiumModel,
  premiumModelList,
} from "@illa-public/market-agent"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  AI_AGENT_MODEL,
  AI_AGENT_TYPE,
  Agent,
  KnowledgeFile,
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
  canManageInvite,
  canUseUpgradeFeature,
  openShareAgentModal,
  showShareAgentModal,
  showShareAgentModalOnlyForShare,
} from "@illa-public/user-role-utils"
import {
  getAgentPublicLink,
  getAuthToken,
  getILLABuilderURL,
  getILLACloudURL,
  sendTagEvent,
} from "@illa-public/utils"
import {
  App,
  Button,
  Divider,
  Image,
  Input,
  Segmented,
  Select,
  message,
} from "antd"
import { isEqual } from "lodash-es"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Controller, useForm, useFormState, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { v4 } from "uuid"
import { TextSignal } from "@/api/ws/textSignal"
import AIIcon from "@/assets/agent/ai.svg?react"
import { AIAgentBlock } from "@/page/AI/components/AIAgentBlock"
import { PreviewChat } from "@/page/AI/components/PreviewChat"
import { useAgentConnect } from "@/page/AI/components/ws/useAgentConnect"
import {
  useCreateAgentMutation,
  useGenerateIconMutation,
  useGeneratePromptDescriptionMutation,
  useGetAgentIconUploadAddressMutation,
  usePutAgentDetailMutation,
} from "@/redux/services/agentAPI"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { fetchUploadBase64 } from "@/utils/file"
import { track } from "@/utils/mixpanelHelper"
import AILoadingIcon from "../components/AILoading/aiLoading.svg?react"
import { ChatContext } from "../components/ChatContext"
import { ErrorText } from "../components/ErrorText"
import KnowledgeUpload from "../components/KnowledgeUpload"
import {
  ChatSendRequestPayload,
  CollaboratorsInfo,
  SenderType,
} from "../components/PreviewChat/interface"
import { AIAgentProps, SCROLL_ID } from "./interface"
import {
  aiAgentContainerStyle,
  backTextStyle,
  buttonContainerStyle,
  codeEditorErrorStyle,
  descContainerStyle,
  descTextStyle,
  docTextContainerStyle,
  docTextStyle,
  labelLogoStyle,
  labelStyle,
  labelTextStyle,
  leftLoadingCoverStyle,
  leftPanelContainerStyle,
  leftPanelContentContainerStyle,
  leftPanelCoverContainer,
  leftPanelHeaderStyle,
  leftPanelTitleTextStyle,
  premiumContainerStyle,
  rightPanelContainerStyle,
  uploadContainerStyle,
  uploadContentContainerStyle,
  uploadTextStyle,
} from "./style"
import { agentData2JSONReport } from "./utils"

// TODO: WTF, can edit knowledge file
const CAN_EDIT_KNOWLEDGE_FILE = false

export const AIAgent: FC<AIAgentProps> = (props) => {
  const { agent } = props

  const methods = useForm<Agent>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      ...agent,
      variables:
        agent.variables.length === 0
          ? [{ key: "", value: "" }]
          : agent.variables,
    },
  })

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    clearErrors,
    setError,
    trigger,
  } = methods

  const { agentID, teamIdentifier } = useParams()

  const { isSubmitting, isDirty, errors } = useFormState({
    control,
  })

  const { t } = useTranslation()

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!!
  const { message: messageApi } = App.useApp()

  const upgradeModal = useUpgradeModal()

  const currentUserInfo = useSelector(getCurrentUser)

  // generateIcon, uploadAgentIcon
  const [putAgentDetail] = usePutAgentDetailMutation()
  const [createAgent] = useCreateAgentMutation()
  const [generatePromptDescription] = useGeneratePromptDescriptionMutation()
  const [generateIcon] = useGenerateIconMutation()
  const [getAgentIconUploadAddress] = useGetAgentIconUploadAddressMutation()

  const dispatch = useDispatch()

  // page state
  const [generateDescLoading, setGenerateDescLoading] = useState(false)
  const [generateIconLoading, setGenerateIconLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [shareDialogVisible, setShareDialogVisible] = useState(false)
  const [contributedDialogVisible, setContributedDialogVisible] =
    useState(false)
  const [defaultShareTag, setDefaultShareTag] = useState<ShareAgentTab>(
    ShareAgentTab.SHARE_WITH_TEAM,
  )

  // data state
  const [inRoomUsers, setInRoomUsers] = useState<CollaboratorsInfo[]>([])
  const [isReceiving, setIsReceiving] = useState(false)
  const [lastRunAgent, setLastRunAgent] = useState<Agent | undefined>()

  // premium dialog
  const canUseBillingFeature = canUseUpgradeFeature(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicensePurchased,
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )

  // ui state

  const updateLocalIcon = useCallback(
    (icon: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      let index = -1
      if (getValues("aiAgentID")) {
        index = updateRoomUsers.findIndex(
          (user) => user.id === getValues("aiAgentID"),
        )
      } else {
        index = updateRoomUsers.findIndex(
          (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
        )
      }
      if (index != -1) {
        updateRoomUsers[index].avatar = icon
      }
      return updateRoomUsers
    },
    [getValues],
  )

  const updateLocalName = useCallback(
    (name: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      let index = -1
      if (getValues("aiAgentID")) {
        index = updateRoomUsers.findIndex(
          (user) => user.id === getValues("aiAgentID"),
        )
      } else {
        index = updateRoomUsers.findIndex(
          (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
        )
      }
      if (index != -1) {
        updateRoomUsers[index].nickname = name
      }
      return updateRoomUsers
    },
    [getValues],
  )

  // watch dirty
  const getRunAgent = useCallback(() => {
    return {
      variables: getValues("variables"),
      model: getValues("model"),
      prompt: getValues("prompt"),
      agentType: getValues("agentType"),
      // TODO: add knowledge
    } as Agent
  }, [getValues])

  const fieldArray = useWatch({
    control: control,
    name: ["variables", "model", "prompt", "agentType"],
  })

  const blockInputDirty = useMemo(() => {
    if (lastRunAgent === undefined) {
      return true
    }
    return (
      !isEqual(
        lastRunAgent.variables.filter((v) => v.key !== "" && v.value !== ""),
        fieldArray[0].filter((v) => v.key !== "" && v.value !== ""),
      ) ||
      !isEqual(lastRunAgent.model, fieldArray[1]) ||
      !isEqual(lastRunAgent.prompt, fieldArray[2]) ||
      !isEqual(lastRunAgent.agentType, fieldArray[3])
    )
  }, [lastRunAgent, fieldArray])

  useEffect(() => {
    const unload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", unload)
    window.addEventListener("onunload", unload)
    return () => {
      window.removeEventListener("beforeunload", unload)
      window.removeEventListener("onunload", unload)
    }
  }, [isDirty])

  const {
    sendMessage,
    generationMessage,
    chatMessages,
    reconnect,
    connect,
    wsStatus,
  } = useAgentConnect({
    onStartRunning: () => {
      setLastRunAgent(getRunAgent())
    },
    onConnecting: (isConnecting) => {
      setIsConnecting(isConnecting)
    },
    onReceiving: (isReceiving) => {
      setIsReceiving(isReceiving)
    },
    onRunning: (isRunning: boolean) => {
      setIsRunning(isRunning)
    },
    onSendClean: () => {
      sendMessage(
        {} as ChatSendRequestPayload,
        TextSignal.CLEAN,
        getValues("agentType"),
        "clean",
        false,
      )
    },
    onSendPrompt: () => {
      sendMessage(
        {
          threadID: v4(),
          prompt: getValues("prompt"),
          variables: getValues("variables"),
          // TODO: add knowledge
          actionID: getValues("aiAgentID"),
          modelConfig: getValues("modelConfig"),
          model: getValues("model"),
          agentType: getValues("agentType"),
        } as ChatSendRequestPayload,
        TextSignal.RUN,
        getValues("agentType"),
        "chat",
        false,
      )
    },
    onUpdateRoomUsers: (roomUsers: CollaboratorsInfo[]) => {
      let newRoomUsers = updateLocalIcon(getValues("icon"), roomUsers)
      newRoomUsers = updateLocalName(getValues("name"), roomUsers)
      setInRoomUsers(newRoomUsers)
    },
  })

  const handleClickBack = () => {
    const cloud_url = getILLACloudURL(window.customDomain)
    if (document.referrer.includes(cloud_url)) {
      return (location.href = `${cloud_url}/workspace/${teamIdentifier}/ai-agents`)
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

  const handleScrollToElement = (scrollId: string) => {
    const el = document.querySelector(`[data-scroll-id=${scrollId}]`)
    setTimeout(() => {
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 30)
  }

  const handleSubmitSave = async (data: Agent) => {
    let currentData: Agent = { ...data }
    if (
      !isPremiumModel(currentData.model) &&
      currentData.knowledge?.length > 0
    ) {
      currentData = {
        ...currentData,
        knowledge: [],
      }
    }
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
      {
        element: "save",
        parameter1: agentData2JSONReport(currentData),
        parameter5: currentData.aiAgentID || "-1",
      },
    )
    let agentInfo: Agent
    try {
      let updateIconURL = currentData.icon
      if (currentData.icon !== undefined && currentData.icon !== "") {
        const iconURL = new URL(currentData.icon)
        if (iconURL.protocol !== "http:" && iconURL.protocol !== "https:") {
          const responseData = await getAgentIconUploadAddress({
            teamID: currentTeamInfo.id,
            base64: currentData.icon,
          }).unwrap()
          updateIconURL = await fetchUploadBase64(
            responseData.uploadAddress,
            currentData.icon,
          )
        }
      }
      if (currentData.aiAgentID === undefined || currentData.aiAgentID === "") {
        const serverAgent = await createAgent({
          teamID: currentTeamInfo.id,
          agentRaw: {
            ...currentData,
            icon: updateIconURL,
            variables: currentData.variables.filter(
              (v) => v.key !== "" && v.value !== "",
            ),
          },
        }).unwrap()

        sendTagEvent("create_agent", currentUserInfo.userID)
        reset({
          ...serverAgent,
          variables:
            serverAgent.variables.length === 0
              ? [{ key: "", value: "" }]
              : serverAgent.variables,
        })
        agentInfo = serverAgent
      } else {
        const serverAgent = await putAgentDetail({
          teamID: currentTeamInfo.id,
          aiAgentID: currentData.aiAgentID,
          agentRaw: {
            ...currentData,
            icon: updateIconURL,
            variables: data.variables.filter(
              (v) => v.key !== "" && v.value !== "",
            ),
          },
        }).unwrap()
        reset({
          ...serverAgent,
          variables:
            serverAgent.variables.length === 0
              ? [{ key: "", value: "" }]
              : serverAgent.variables,
        })
        agentInfo = serverAgent
      }
      message.success({
        content: t("dashboard.message.create-suc"),
      })
      return agentInfo
    } catch (e) {
      message.error({
        content: t("dashboard.message.create-failed"),
      })
    }
  }

  const handleVerifyOnSave = async () => {
    await trigger()
    let validate = true
    if (!!errors.prompt) {
      handleScrollToElement(SCROLL_ID.PROMPT)
      validate = false
    } else if (!!errors.knowledge) {
      handleScrollToElement(SCROLL_ID.KNOWLEDGE)
      validate = false
    } else if (!!errors.variables) {
      handleScrollToElement(SCROLL_ID.VARIABLES)
      validate = false
    } else if (!!errors.name) {
      handleScrollToElement(SCROLL_ID.NAME)
      validate = false
    } else if (!!errors.description) {
      handleScrollToElement(SCROLL_ID.DESCRIPTION)
      validate = false
    } else if (!!errors.icon) {
      handleScrollToElement(SCROLL_ID.ICON)
      validate = false
    }
    return validate
  }

  const handleVerifyOnStart = () => {
    clearErrors()
    if (!getValues("prompt")) {
      setError("prompt", {
        type: "required",
        message: t("editor.ai-agent.validation_blank.prompt"),
      })
      handleScrollToElement(SCROLL_ID.PROMPT)
      return false
    } else if (
      !getValues("variables").every(
        (param) =>
          (param.key === "" && param.value === "") ||
          (param.key !== "" && param.value !== ""),
      )
    ) {
      setError("variables", {
        type: "validate",
        message: t("editor.ai-agent.validation_blank.variable_value"),
      })
      handleScrollToElement(SCROLL_ID.VARIABLES)
      return false
    } else if (
      Array.isArray(getValues("knowledge")) &&
      getValues("knowledge").length > 0 &&
      getValues("knowledge").some((param) => param.value === "")
    ) {
      setError("variables", {
        type: "knowledge",
        message: t("dashboard.message.parsing_file_in_prog"),
      })
      handleScrollToElement(SCROLL_ID.KNOWLEDGE)
      return false
    }
    return true
  }

  const handleClickStart = async () => {
    if (!handleVerifyOnStart()) {
      return
    }
    if (isPremiumModel(getValues("model")) && !canUseBillingFeature) {
      upgradeModal({
        modalType: "agent",
        from: "agent_run_gpt4",
      })
      return
    }
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
      {
        element: isRunning ? "restart" : "start",
        parameter1: agentData2JSONReport(getValues()),
        parameter5: getValues("aiAgentID") || "-1",
      },
    )
    isRunning
      ? await reconnect(getValues("aiAgentID"), getValues("agentType"))
      : await connect(getValues("aiAgentID"), getValues("agentType"))
  }

  return (
    <>
      <Helmet>
        <title>
          {agentID ? agent.name : t("new_dashboard.button.blank-agent")}
        </title>
      </Helmet>
      <ChatContext.Provider value={{ inRoomUsers }}>
        <div css={aiAgentContainerStyle}>
          <div css={leftPanelContainerStyle}>
            <div css={leftPanelCoverContainer}>
              <div css={leftPanelHeaderStyle}>
                <div css={leftPanelTitleTextStyle} onClick={handleClickBack}>
                  <Icon component={PreviousIcon} />
                  <span css={backTextStyle}>{t("editor.ai-agent.title")}</span>
                </div>
                <Button
                  type="link"
                  href="https://docs.illacloud.com/ai-agent"
                  target="__blank"
                  css={docTextContainerStyle}
                >
                  <div css={docTextStyle}>
                    <Icon component={DocsIcon} />
                    <span>{t("editor.ai-agent.doc")}</span>
                  </div>
                </Button>
              </div>
              <div css={leftPanelContentContainerStyle}>
                <Controller
                  name="agentType"
                  control={control}
                  shouldUnregister={false}
                  render={({ field }) => (
                    <AIAgentBlock
                      title={t("editor.ai-agent.label.mode")}
                      tips={t("editor.ai-agent.tips.mode")}
                      required
                    >
                      <Segmented
                        block
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
                            messageApi.info({
                              content: t("editor.ai-agent.message.generating"),
                            })
                            return
                          }
                          track(
                            ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                            ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                            {
                              element: "mode_radio_button",
                              parameter1: value,
                              parameter5: agent.aiAgentID || "-1",
                            },
                          )
                          field.onChange(value)
                        }}
                        value={field.value}
                      />
                    </AIAgentBlock>
                  )}
                />
                <Controller
                  name="prompt"
                  control={control}
                  rules={{
                    required: t("editor.ai-agent.validation_blank.prompt"),
                  }}
                  shouldUnregister={false}
                  render={({ field: promptField }) => (
                    <AIAgentBlock
                      title={"Prompt"}
                      required
                      scrollId={SCROLL_ID.PROMPT}
                    >
                      <Controller
                        name="variables"
                        control={control}
                        render={({ field: variables }) => (
                          <div>
                            <CodeEditor
                              {...promptField}
                              css={codeEditorErrorStyle(!!errors.prompt)}
                              placeholder={t(
                                "editor.ai-agent.placeholder.prompt",
                              )}
                              minHeight="200px"
                              completionOptions={variables.value}
                            />
                            {errors.prompt?.message && (
                              <ErrorText
                                errorMessage={errors.prompt?.message}
                              />
                            )}
                          </div>
                        )}
                      />
                    </AIAgentBlock>
                  )}
                />

                <Controller
                  name="variables"
                  control={control}
                  rules={{
                    validate: (value) => {
                      const isValidate = value.every(
                        (param) =>
                          (param.key === "" && param.value === "") ||
                          (param.key !== "" && param.value !== ""),
                      )
                      return isValidate
                        ? isValidate
                        : t(
                            "Please ensure that both the key and value are either empty or not empty.",
                          )
                    },
                  }}
                  shouldUnregister={false}
                  render={({ field }) => (
                    <AIAgentBlock
                      title={t("editor.ai-agent.label.variable")}
                      scrollId={SCROLL_ID.VARIABLES}
                    >
                      <RecordEditor
                        records={field.value}
                        onAdd={() => {
                          field.onChange([
                            ...field.value,
                            {
                              key: "",
                              value: "",
                            },
                          ])
                        }}
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
                        onDelete={(index) => {
                          const newVariables = [...field.value]
                          newVariables.splice(index, 1)
                          if (newVariables.length === 0) {
                            newVariables.push({
                              key: "",
                              value: "",
                            })
                          }
                          field.onChange(newVariables)
                        }}
                        label={""}
                      />
                      {errors.variables?.message && (
                        <ErrorText errorMessage={errors.variables?.message} />
                      )}
                    </AIAgentBlock>
                  )}
                />

                {CAN_EDIT_KNOWLEDGE_FILE &&
                  isPremiumModel(getValues("model")) && (
                    <Controller
                      name="knowledge"
                      control={control}
                      rules={{
                        validate: (value) => {
                          const isValidate =
                            !value ||
                            value.length === 0 ||
                            value.every((param) => param.value !== "")
                          return isValidate ? isValidate : t("")
                        },
                      }}
                      shouldUnregister={false}
                      render={({ field }) => (
                        <AIAgentBlock
                          title={t("knowledge")}
                          scrollId={SCROLL_ID.KNOWLEDGE}
                        >
                          <KnowledgeUpload
                            addFile={(
                              file: KnowledgeFile,
                              isUpdate?: boolean,
                            ) => {
                              const { name, type } = file
                              const files = field.value || []
                              const index = files.findIndex(
                                (item) =>
                                  item.name === name && item.type === type,
                              )
                              if (index !== -1) {
                                if (isUpdate) {
                                  let needUpdateFile = files[index]
                                  files.splice(index, 1, {
                                    ...needUpdateFile,
                                    ...file,
                                  })
                                } else {
                                  const fileNamePrefix = `${
                                    file.name.split(".")[0]
                                  }(${v4().slice(0, 3)})`

                                  files.push({
                                    ...file,
                                    name: `${fileNamePrefix}.${
                                      file.name.split(".")?.[1]
                                    }`,
                                  })
                                }
                              } else {
                                files.push(file)
                              }
                              field.onChange(files)
                            }}
                            removeFile={(name: string) => {
                              const currentFiles = field.value || []
                              const files = currentFiles.filter(
                                (item) => item.name !== name,
                              )
                              field.onChange(files)
                            }}
                            values={field.value}
                          />
                        </AIAgentBlock>
                      )}
                    />
                  )}

                <Controller
                  name="model"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  shouldUnregister={false}
                  render={({ field }) => (
                    <AIAgentBlock
                      title={t("editor.ai-agent.label.model")}
                      required
                    >
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        onClick={() => {
                          track(
                            ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                            ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                            {
                              element: "model",
                              parameter1: field.value,
                              parameter5: agent.aiAgentID || "-1",
                            },
                          )
                        }}
                        onChange={(value) => {
                          track(
                            ILLA_MIXPANEL_EVENT_TYPE.CHANGE,
                            ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                            {
                              element: "model",
                              parameter1: value,
                              parameter5: agent.aiAgentID || "-1",
                            },
                          )
                          if (
                            isPremiumModel(value as AI_AGENT_MODEL) &&
                            !canUseBillingFeature
                          ) {
                            upgradeModal({
                              modalType: "agent",
                              from: "agent_edit_gpt4",
                            })
                            return
                          }
                          field.onChange(value)
                        }}
                        options={[
                          ...freeModelList.map((model) => {
                            return {
                              label: (
                                <div css={labelStyle}>
                                  <span css={labelLogoStyle}>{model.logo}</span>
                                  <span css={labelTextStyle}>{model.name}</span>
                                </div>
                              ),
                              value: model.value,
                            }
                          }),
                          ...premiumModelList.map((model) => {
                            return {
                              label: (
                                <div css={labelStyle}>
                                  <span css={labelLogoStyle}>{model.logo}</span>
                                  <span css={labelTextStyle}>{model.name}</span>
                                  {!canUseBillingFeature && (
                                    <div css={premiumContainerStyle}>
                                      <UpgradeIcon />
                                      <div style={{ marginLeft: 4 }}>
                                        Premium
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ),
                              value: model.value,
                            }
                          }),
                        ]}
                      />
                    </AIAgentBlock>
                  )}
                />
                <Divider>{t("editor.ai-agent.group.information")}</Divider>
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: t("editor.ai-agent.validation_blank.name"),
                  }}
                  shouldUnregister={false}
                  render={({ field }) => (
                    <AIAgentBlock
                      title={t("editor.ai-agent.label.name")}
                      required
                      scrollId={SCROLL_ID.NAME}
                    >
                      <Input
                        {...field}
                        placeholder={t("editor.ai-agent.placeholder.name")}
                        status={!!errors.name ? "error" : undefined}
                        maxLength={60}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value)
                          setInRoomUsers(updateLocalName(value, inRoomUsers))
                        }}
                      />
                      {errors.name?.message && (
                        <ErrorText errorMessage={errors.name?.message} />
                      )}
                    </AIAgentBlock>
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: t("editor.ai-agent.validation_blank.description"),
                    maxLength: {
                      value: 160,
                      message: t("editor.ai-agent.length_invalid.description"),
                    },
                  }}
                  shouldUnregister={false}
                  render={({ field }) => (
                    <AIAgentBlock
                      title={t("editor.ai-agent.label.desc")}
                      subtitleTips={t("editor.ai-agent.generate-desc.tooltips")}
                      required
                      scrollId={SCROLL_ID.DESCRIPTION}
                      subtitle={
                        <div
                          css={descContainerStyle}
                          onClick={async () => {
                            track(
                              ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                              ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                              {
                                element: "desc_generate",
                                parameter1: getValues("prompt") ? true : false,
                                parameter5: agent.aiAgentID || "-1",
                              },
                            )
                            const currentTime = performance.now()
                            if (!getValues("prompt")) {
                              messageApi.error({
                                content: t(
                                  "editor.ai-agent.generate-desc.blank",
                                ),
                              })
                              return
                            }
                            setGenerateDescLoading(true)
                            try {
                              const desc = await generatePromptDescription({
                                teamID: currentTeamInfo.id,
                                prompt: getValues("prompt"),
                              }).unwrap()
                              track(
                                ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                {
                                  element: "desc_generate",
                                  consume: performance.now() - currentTime,
                                  parameter2: "suc",
                                },
                              )
                              field.onChange(desc.payload)
                            } catch (e) {
                              track(
                                ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                {
                                  element: "desc_generate",
                                  consume: performance.now() - currentTime,
                                  parameter2: "failed",
                                },
                              )
                              messageApi.error({
                                content: t(
                                  "editor.ai-agent.generate-desc.failed",
                                ),
                              })
                            } finally {
                              setGenerateDescLoading(false)
                            }
                          }}
                        >
                          {generateDescLoading ? (
                            <Icon
                              component={AILoadingIcon}
                              spin
                              style={{
                                fontSize: "12px",
                              }}
                            />
                          ) : (
                            <AIIcon />
                          )}
                          <div css={descTextStyle}>
                            {t("editor.ai-agent.generate-desc.button")}
                          </div>
                        </div>
                      }
                    >
                      <Input.TextArea
                        {...field}
                        status={!!errors.description ? "error" : undefined}
                        maxLength={160}
                        placeholder={t("editor.ai-agent.placeholder.desc")}
                        rows={5}
                      />
                      {errors.description?.message && (
                        <ErrorText errorMessage={errors.description?.message} />
                      )}
                    </AIAgentBlock>
                  )}
                />
                <Controller
                  name="icon"
                  control={control}
                  rules={{
                    required: t("editor.ai-agent.validation_blank.icon"),
                  }}
                  shouldUnregister={false}
                  render={({ field }) => (
                    <AIAgentBlock
                      title={t("editor.ai-agent.label.icon")}
                      required
                      scrollId={SCROLL_ID.ICON}
                      subtitle={
                        <div
                          css={descContainerStyle}
                          onClick={async () => {
                            track(
                              ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                              ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                              {
                                element: "icon_generate",
                                parameter1: getValues("prompt") ? true : false,
                                parameter5: agent.aiAgentID || "-1",
                              },
                            )
                            const currentTime = performance.now()
                            if (
                              !getValues("name") ||
                              !getValues("description")
                            ) {
                              messageApi.error({
                                content: t(
                                  "editor.ai-agent.generate-icon.blank",
                                ),
                              })
                              return
                            }
                            setGenerateIconLoading(true)
                            try {
                              const icon = await generateIcon({
                                teamID: currentTeamInfo.id,
                                name: getValues("name"),
                                description: getValues("description"),
                              }).unwrap()

                              track(
                                ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                {
                                  element: "icon_generate",
                                  consume: performance.now() - currentTime,
                                  parameter2: "suc",
                                },
                              )
                              field.onChange(icon.payload)
                            } catch (e) {
                              track(
                                ILLA_MIXPANEL_EVENT_TYPE.REQUEST,
                                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                {
                                  element: "icon_generate",
                                  consume: performance.now() - currentTime,
                                  parameter2: "failed",
                                },
                              )
                              messageApi.error({
                                content: t(
                                  "editor.ai-agent.generate-desc.failed",
                                ),
                              })
                            } finally {
                              setGenerateIconLoading(false)
                            }
                          }}
                        >
                          {generateIconLoading ? (
                            <Icon
                              component={AILoadingIcon}
                              spin
                              style={{
                                fontSize: "12px",
                              }}
                            />
                          ) : (
                            <AIIcon />
                          )}
                          <div css={descTextStyle}>
                            {t("editor.ai-agent.generate-desc.button")}
                          </div>
                        </div>
                      }
                      subtitleTips={t("editor.ai-agent.generate-icon.tooltips")}
                    >
                      <MixpanelTrackProvider
                        basicTrack={track}
                        pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT}
                      >
                        <AvatarUpload
                          onOk={async (file) => {
                            let reader = new FileReader()
                            reader.onload = () => {
                              field.onChange(reader.result)
                              setInRoomUsers(
                                updateLocalIcon(
                                  reader.result as string,
                                  inRoomUsers,
                                ),
                              )
                            }
                            reader.readAsDataURL(file)
                            return true
                          }}
                        >
                          <div
                            onClick={() => {
                              track(
                                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                {
                                  element: "avater",
                                },
                              )
                            }}
                          >
                            {!field.value ? (
                              <div>
                                <div css={uploadContainerStyle}>
                                  <div css={uploadContentContainerStyle}>
                                    <Icon
                                      component={PlusIcon}
                                      color={getColor("grayBlue", "03")}
                                    />

                                    <div css={uploadTextStyle}>
                                      {t("editor.ai-agent.placeholder.icon")}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={field.value}
                                css={uploadContentContainerStyle}
                                width="100px"
                                height="100px"
                              />
                            )}
                          </div>
                        </AvatarUpload>
                      </MixpanelTrackProvider>
                      {errors.icon?.message && (
                        <ErrorText errorMessage={errors.icon?.message} />
                      )}
                    </AIAgentBlock>
                  )}
                />
              </div>
              {(isConnecting || isSubmitting) && (
                <div css={leftLoadingCoverStyle} />
              )}
            </div>
            <form onSubmit={handleSubmit(handleSubmitSave)}>
              <div css={buttonContainerStyle}>
                <Button
                  block
                  size="large"
                  type="default"
                  loading={isConnecting}
                  icon={
                    isRunning ? (
                      <Icon component={ResetIcon} />
                    ) : (
                      <Icon component={PlayFillIcon} />
                    )
                  }
                  onClick={handleClickStart}
                >
                  {!isRunning
                    ? t("editor.ai-agent.start")
                    : t("editor.ai-agent.restart")}
                </Button>
                <Button
                  block
                  id="save-button"
                  onClick={handleVerifyOnSave}
                  size="large"
                  loading={isSubmitting}
                  type="primary"
                >
                  {t("editor.ai-agent.save")}
                </Button>
              </div>
            </form>
          </div>
          <Controller
            name="agentType"
            control={control}
            shouldUnregister={false}
            render={({ field }) => (
              <Controller
                name="aiAgentID"
                control={control}
                render={({ field: idField }) => (
                  <Controller
                    render={({ field: contributeField }) => (
                      <div css={rightPanelContainerStyle}>
                        <MixpanelTrackProvider
                          basicTrack={track}
                          pageName={
                            ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT
                          }
                        >
                          <PreviewChat
                            wsStatus={wsStatus}
                            showShareDialog={showShareAgentModalOnlyForShare(
                              currentTeamInfo,
                            )}
                            showContributeDialog={showShareAgentModal(
                              currentTeamInfo,
                              currentTeamInfo.myRole,
                              contributeField.value,
                            )}
                            showEditPanel={false}
                            isRunning={isRunning}
                            isConnecting={isConnecting}
                            hasCreated={Boolean(idField.value)}
                            isMobile={false}
                            model={getValues("model")}
                            editState="EDIT"
                            agentType={field.value}
                            chatMessages={chatMessages}
                            generationMessage={generationMessage}
                            isReceiving={isReceiving}
                            blockInput={!isRunning || blockInputDirty}
                            onSendMessage={(
                              message,
                              agentType: AI_AGENT_TYPE,
                            ) => {
                              track(
                                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                {
                                  element: "send",
                                  parameter5: getValues("aiAgentID") || "-1",
                                },
                              )
                              sendMessage(
                                {
                                  threadID: message.threadID,
                                  prompt: message.message,
                                  variables: [],
                                  actionID: getValues("aiAgentID"),
                                  modelConfig: getValues("modelConfig"),
                                  model: getValues("model"),
                                  agentType: getValues("agentType"),
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
                            onShowShareDialog={() => {
                              setDefaultShareTag(ShareAgentTab.SHARE_WITH_TEAM)
                              setShareDialogVisible(true)
                              track(
                                ILLA_MIXPANEL_EVENT_TYPE.SHOW,
                                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                {
                                  element: "share_modal",
                                  parameter5: agent.aiAgentID,
                                },
                              )
                            }}
                            onShowContributeDialog={() => {
                              if (contributeField.value) {
                                setDefaultShareTag(ShareAgentTab.TO_MARKETPLACE)
                                setShareDialogVisible(true)
                                track(
                                  ILLA_MIXPANEL_EVENT_TYPE.SHOW,
                                  ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                                  {
                                    element: "share_modal",
                                    parameter5: agent.aiAgentID,
                                  },
                                )
                              } else {
                                if (
                                  !openShareAgentModal(
                                    currentTeamInfo,
                                    currentTeamInfo.myRole,
                                    contributeField.value,
                                  )
                                ) {
                                  upgradeModal({
                                    modalType: "upgrade",
                                    from: "agent_edit_contribute",
                                  })
                                  return
                                }
                                setContributedDialogVisible(true)
                              }
                            }}
                          />
                        </MixpanelTrackProvider>
                      </div>
                    )}
                    name="publishedToMarketplace"
                    control={control}
                  />
                )}
              />
            )}
          />
        </div>
        <Controller
          control={control}
          name="aiAgentID"
          render={({ field: idField }) => (
            <Controller
              control={control}
              name="name"
              render={({ field: nameField }) => (
                <Controller
                  control={control}
                  name="publishedToMarketplace"
                  render={({ field }) => (
                    <MixpanelTrackProvider
                      basicTrack={track}
                      pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT}
                    >
                      {shareDialogVisible && (
                        <ShareAgentPC
                          itemID={idField.value}
                          onInvitedChange={(userList) => {
                            const memberListInfo: MemberInfo[] = userList.map(
                              (user) => {
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
                              },
                            )
                            dispatch(
                              teamActions.updateInvitedUserReducer(
                                memberListInfo,
                              ),
                            )
                          }}
                          canUseBillingFeature={canUseUpgradeFeature(
                            currentTeamInfo.myRole,
                            getPlanUtils(currentTeamInfo),
                            currentTeamInfo.totalTeamLicense
                              .teamLicensePurchased,
                            currentTeamInfo.totalTeamLicense.teamLicenseAllPaid,
                          )}
                          title={t(
                            "user_management.modal.social_media.default_text.agent",
                            {
                              agentName: nameField.value,
                            },
                          )}
                          redirectURL={`${getILLABuilderURL(
                            window.customDomain,
                          )}/${currentTeamInfo.identifier}/ai-agent/${
                            idField.value
                          }`}
                          onClose={() => {
                            setShareDialogVisible(false)
                          }}
                          canInvite={canManageInvite(
                            currentTeamInfo.myRole,
                            currentTeamInfo.permission
                              .allowEditorManageTeamMember,
                            currentTeamInfo.permission
                              .allowViewerManageTeamMember,
                          )}
                          defaultTab={defaultShareTag}
                          defaultInviteUserRole={USER_ROLE.VIEWER}
                          teamID={currentTeamInfo.id}
                          currentUserRole={currentTeamInfo.myRole}
                          defaultBalance={
                            currentTeamInfo.currentTeamLicense.balance
                          }
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
                          agentID={idField.value}
                          defaultAgentContributed={field.value}
                          onAgentContributed={(isAgentContributed) => {
                            field.onChange(isAgentContributed)
                            if (isAgentContributed) {
                              const newUrl = new URL(
                                getAgentPublicLink(idField.value),
                              )
                              newUrl.searchParams.set("token", getAuthToken())
                              window.open(newUrl, "_blank")
                            }
                          }}
                          onCopyInviteLink={(link) => {
                            track(
                              ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                              ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                              {
                                element: "share_modal_copy_team",
                                parameter5: idField.value,
                              },
                            )
                            copyToClipboard(
                              t(
                                "user_management.modal.custom_copy_text_agent_invite",
                                {
                                  userName: currentUserInfo.nickname,
                                  teamName: currentTeamInfo.name,
                                  inviteLink: link,
                                },
                              ),
                            )
                          }}
                          onCopyAgentMarketLink={(link) => {
                            track(
                              ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                              ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                              {
                                element: "share_modal_link",
                                parameter5: idField.value,
                              },
                            )
                            copyToClipboard(
                              t(
                                "user_management.modal.contribute.default_text.agent",
                                {
                                  agentName: nameField.value,
                                  agentLink: link,
                                },
                              ),
                            )
                          }}
                          userRoleForThisAgent={currentTeamInfo.myRole}
                          ownerTeamID={currentTeamInfo.id}
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
                              ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                              {
                                element: "share_modal_social_media",
                                parameter4: platform,
                                parameter5: idField.value,
                              },
                            )
                          }}
                        />
                      )}
                      {contributedDialogVisible && (
                        <ContributeAgentPC
                          onContributed={(isAgentContributed) => {
                            field.onChange(isAgentContributed)
                            if (isAgentContributed) {
                              const newUrl = new URL(
                                getAgentPublicLink(idField.value),
                              )
                              newUrl.searchParams.set("token", getAuthToken())
                              window.open(newUrl, "_blank")
                            }
                          }}
                          teamID={currentTeamInfo.id}
                          onClose={() => {
                            setContributedDialogVisible(false)
                          }}
                          productID={idField.value}
                          productType={HASHTAG_REQUEST_TYPE.UNIT_TYPE_AI_AGENT}
                          productContributed={field.value}
                        />
                      )}
                    </MixpanelTrackProvider>
                  )}
                />
              )}
            />
          )}
        />
      </ChatContext.Provider>
    </>
  )
}

AIAgent.displayName = "AIAgent"
