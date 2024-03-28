import Icon from "@ant-design/icons"
import { Button, Dropdown, MenuProps } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { InfoIcon, MoreIcon, PenIcon, ShareIcon } from "@illa-public/icon"
import { ShareAgentMobile, ShareAgentPC } from "@illa-public/invite-modal"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
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
import { useDetailTipis, useEditTipis } from "@/utils/recentTabs/hook"
import { IMoreActionButtonProps } from "./interface"

const MoreActionButton: FC<IMoreActionButtonProps> = (props) => {
  const { agentID, agentName, publishToMarketplace, isMobile, agentIcon } =
    props
  const { t } = useTranslation()
  const [shareVisible, setShareVisible] = useState(false)
  const dispatch = useDispatch()
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const currentUser = useSelector(getCurrentUser)
  const editTipis = useEditTipis()
  const detailTipis = useDetailTipis()

  const canInvite = canManageInvite(
    teamInfo.myRole,
    teamInfo.permission.allowEditorManageTeamMember,
    teamInfo.permission.allowViewerManageTeamMember,
  )

  const items: MenuProps["items"] = [
    {
      key: "edit",
      label: t("dashboard.common.edit"),
      icon: <Icon component={PenIcon} />,
    },
    {
      key: "share",
      label: t("share"),
      icon: <Icon component={ShareIcon} />,
    },
    {
      key: "detail",
      label: t("homepage.run_tipi.more.detail"),
      icon: <Icon component={InfoIcon} />,
    },
  ]

  const onClickMenuItem: MenuProps["onClick"] = async ({ key, domEvent }) => {
    domEvent.stopPropagation()
    switch (key) {
      case "share":
        {
          setShareVisible(true)
        }
        break
      case "edit": {
        editTipis(agentID)
        break
      }
      case "detail": {
        detailTipis({
          tipisID: agentID,
          title: agentName,
          tabIcon: agentIcon,
        })
        break
      }
      default:
        break
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items, onClick: onClickMenuItem }}
        placement="bottomLeft"
      >
        {isMobile ? (
          <Button icon={<Icon component={MoreIcon} />} type="text" />
        ) : (
          <Button size="large" icon={<Icon component={MoreIcon} />} />
        )}
      </Dropdown>
      {shareVisible &&
        (isMobile ? (
          <ShareAgentMobile
            itemID={agentID}
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
              teamInfo.myRole,
              getPlanUtils(teamInfo),
              teamInfo.totalTeamLicense?.teamLicensePurchased,
              teamInfo.totalTeamLicense?.teamLicenseAllPaid,
            )}
            title={t("user_management.modal.social_media.default_text.agent", {
              agentName: agentName,
            })}
            redirectURL={`${getILLACloudURL(window.customDomain)}/${
              teamInfo.identifier
            }/ai-agent/${agentID}/run?myTeamIdentifier=${teamInfo.identifier}`}
            onClose={() => {
              setShareVisible(false)
            }}
            canInvite={canInvite}
            defaultInviteUserRole={USER_ROLE.VIEWER}
            teamID={teamInfo.id}
            currentUserRole={teamInfo.myRole}
            defaultBalance={teamInfo.currentTeamLicense.balance}
            defaultAllowInviteLink={teamInfo.permission.inviteLinkEnabled}
            onInviteLinkStateChange={(enableInviteLink) => {
              dispatch(
                teamActions.updateTeamMemberPermissionReducer({
                  teamID: teamInfo.id,
                  newPermission: {
                    ...teamInfo.permission,
                    inviteLinkEnabled: enableInviteLink,
                  },
                }),
              )
            }}
            agentID={agentID}
            defaultAgentContributed={publishToMarketplace}
            onAgentContributed={(isAgentContributed) => {
              if (isAgentContributed) {
                const newUrl = new URL(getAgentPublicLink(agentID))
                newUrl.searchParams.set("token", getAuthToken())
                window.open(newUrl, "_blank")
              }
            }}
            onCopyInviteLink={(link) => {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                ILLA_MIXPANEL_CLOUD_PAGE_NAME.AI_AGENT_DASHBOARD,
                {
                  element: "share_modal_copy_team",
                  parameter5: agentID,
                },
              )
              copyToClipboard(
                t("user_management.modal.custom_copy_text_agent_invite", {
                  userName: currentUser.nickname,
                  teamName: teamInfo.name,
                  inviteLink: link,
                }),
              )
            }}
            onCopyAgentMarketLink={(link) => {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                ILLA_MIXPANEL_CLOUD_PAGE_NAME.AI_AGENT_DASHBOARD,
                {
                  element: "share_modal_link",
                  parameter5: agentID,
                },
              )
              copyToClipboard(
                t("user_management.modal.contribute.default_text.agent", {
                  agentName: agentName,
                  agentLink: link,
                }),
              )
            }}
            userRoleForThisAgent={teamInfo.myRole}
            ownerTeamID={teamInfo.id}
            onBalanceChange={(balance) => {
              dispatch(
                teamActions.updateTeamMemberSubscribeReducer({
                  teamID: teamInfo.id,
                  subscribeInfo: {
                    ...teamInfo.currentTeamLicense,
                    balance: balance,
                  },
                }),
              )
            }}
            onShare={(platform) => {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                ILLA_MIXPANEL_CLOUD_PAGE_NAME.AI_AGENT_DASHBOARD,
                {
                  element: "share_modal_social_media",
                  parameter4: platform,
                  parameter5: agentID,
                },
              )
            }}
            teamPlan={getPlanUtils(teamInfo)}
          />
        ) : (
          <ShareAgentPC
            itemID={agentID}
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
              teamInfo.myRole,
              getPlanUtils(teamInfo),
              teamInfo.totalTeamLicense?.teamLicensePurchased,
              teamInfo.totalTeamLicense?.teamLicenseAllPaid,
            )}
            title={t("user_management.modal.social_media.default_text.agent", {
              agentName: agentName,
            })}
            redirectURL={`${getILLACloudURL(window.customDomain)}/${
              teamInfo.identifier
            }/ai-agent/${agentID}/run?myTeamIdentifier=${teamInfo.identifier}`}
            onClose={() => {
              setShareVisible(false)
            }}
            canInvite={canInvite}
            defaultInviteUserRole={USER_ROLE.VIEWER}
            teamID={teamInfo.id}
            currentUserRole={teamInfo.myRole}
            defaultBalance={teamInfo.currentTeamLicense.balance}
            defaultAllowInviteLink={teamInfo.permission.inviteLinkEnabled}
            onInviteLinkStateChange={(enableInviteLink) => {
              dispatch(
                teamActions.updateTeamMemberPermissionReducer({
                  teamID: teamInfo.id,
                  newPermission: {
                    ...teamInfo.permission,
                    inviteLinkEnabled: enableInviteLink,
                  },
                }),
              )
            }}
            agentID={agentID}
            defaultAgentContributed={publishToMarketplace}
            onAgentContributed={(isAgentContributed) => {
              if (isAgentContributed) {
                const newUrl = new URL(getAgentPublicLink(agentID))
                newUrl.searchParams.set("token", getAuthToken())
                window.open(newUrl, "_blank")
              }
            }}
            onCopyInviteLink={(link) => {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                ILLA_MIXPANEL_CLOUD_PAGE_NAME.AI_AGENT_DASHBOARD,
                {
                  element: "share_modal_copy_team",
                  parameter5: agentID,
                },
              )
              copyToClipboard(
                t("user_management.modal.custom_copy_text_agent_invite", {
                  userName: currentUser.nickname,
                  teamName: teamInfo.name,
                  inviteLink: link,
                }),
              )
            }}
            onCopyAgentMarketLink={(link) => {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                ILLA_MIXPANEL_CLOUD_PAGE_NAME.AI_AGENT_DASHBOARD,
                {
                  element: "share_modal_link",
                  parameter5: agentID,
                },
              )
              copyToClipboard(
                t("user_management.modal.contribute.default_text.agent", {
                  agentName: agentName,
                  agentLink: link,
                }),
              )
            }}
            userRoleForThisAgent={teamInfo.myRole}
            ownerTeamID={teamInfo.id}
            onBalanceChange={(balance) => {
              dispatch(
                teamActions.updateTeamMemberSubscribeReducer({
                  teamID: teamInfo.id,
                  subscribeInfo: {
                    ...teamInfo.currentTeamLicense,
                    balance: balance,
                  },
                }),
              )
            }}
            onShare={(platform) => {
              track(
                ILLA_MIXPANEL_EVENT_TYPE.CLICK,
                ILLA_MIXPANEL_CLOUD_PAGE_NAME.AI_AGENT_DASHBOARD,
                {
                  element: "share_modal_social_media",
                  parameter4: platform,
                  parameter5: agentID,
                },
              )
            }}
            teamPlan={getPlanUtils(teamInfo)}
          />
        ))}
    </>
  )
}

export default MoreActionButton
