import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import {
  ContributeAgentPC,
  HASHTAG_REQUEST_TYPE,
  ShareAgentPC,
} from "@illa-public/invite-modal"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  Agent,
  MemberInfo,
  USER_ROLE,
  USER_STATUS,
} from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  getCurrentUser,
  getPlanUtils,
  teamActions,
} from "@illa-public/user-data"
import {
  canManageInvite,
  canUseUpgradeFeature,
} from "@illa-public/user-role-utils"
import {
  getAgentPublicLink,
  getAuthToken,
  getILLACloudURL,
} from "@illa-public/utils"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { track } from "@/utils/mixpanelHelper"
import { IShareAndContributeModalProps } from "./interface"

const ShareAndContributeModal: FC<IShareAndContributeModalProps> = (props) => {
  const {
    shareDialogVisible,
    contributedDialogVisible,
    defaultShareTag,
    setShareDialogVisible,
    setContributedDialogVisible,
  } = props
  const { control, setValue } = useFormContext<Agent>()
  const [aiAgentID, publishedToMarketplace, agentName] = useWatch({
    control: control,
    name: ["aiAgentID", "publishedToMarketplace", "name"],
  })
  const dispatch = useDispatch()

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const currentUserInfo = useSelector(getCurrentUser)

  const { t } = useTranslation()

  return (
    <>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT}
      >
        {shareDialogVisible && (
          <ShareAgentPC
            itemID={aiAgentID}
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
            title={t("user_management.modal.social_media.default_text.agent", {
              agentName: agentName,
            })}
            redirectURL={`${getILLACloudURL(
              window.customDomain,
            )}/${currentTeamInfo.identifier}/ai-agent/${aiAgentID}`}
            onClose={() => {
              setShareDialogVisible(false)
            }}
            canInvite={canManageInvite(
              currentTeamInfo.myRole,
              currentTeamInfo.permission.allowEditorManageTeamMember,
              currentTeamInfo.permission.allowViewerManageTeamMember,
            )}
            defaultTab={defaultShareTag}
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
            agentID={aiAgentID}
            defaultAgentContributed={publishedToMarketplace}
            onAgentContributed={(isAgentContributed) => {
              setValue("publishedToMarketplace", isAgentContributed)
              if (isAgentContributed) {
                const newUrl = new URL(getAgentPublicLink(aiAgentID))
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
                  parameter5: aiAgentID,
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
            onCopyAgentMarketLink={(link) => {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
                {
                  element: "share_modal_link",
                  parameter5: aiAgentID,
                },
              )
              copyToClipboard(
                t("user_management.modal.contribute.default_text.agent", {
                  agentName: agentName,
                  agentLink: link,
                }),
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
                  parameter5: aiAgentID,
                },
              )
            }}
          />
        )}
        {contributedDialogVisible && (
          <ContributeAgentPC
            onContributed={(isAgentContributed) => {
              setValue("publishedToMarketplace", isAgentContributed)
              if (isAgentContributed) {
                const newUrl = new URL(getAgentPublicLink(aiAgentID))
                newUrl.searchParams.set("token", getAuthToken())
                window.open(newUrl, "_blank")
              }
            }}
            teamID={currentTeamInfo.id}
            onClose={() => {
              setContributedDialogVisible(false)
            }}
            productID={aiAgentID}
            productType={HASHTAG_REQUEST_TYPE.UNIT_TYPE_AI_AGENT}
            productContributed={publishedToMarketplace}
          />
        )}
      </MixpanelTrackProvider>
    </>
  )
}

ShareAndContributeModal.displayName = "ContributeButton"

export default ShareAndContributeModal
