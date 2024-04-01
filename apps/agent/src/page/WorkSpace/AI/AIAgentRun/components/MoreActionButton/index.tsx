import Icon from "@ant-design/icons"
import { Button, Dropdown, MenuProps } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { InfoIcon, MoreIcon, PenIcon, ShareIcon } from "@illa-public/icon"
import { ShareAgentMobile, ShareAgentPC } from "@illa-public/invite-modal"
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
import { getRunTipiPath } from "@/utils/routeHelper"
import {
  useNavigateToEditTipis,
  useNavigateToTipiDetail,
} from "@/utils/routeHelper/hook"
import { IMoreActionButtonProps } from "./interface"

const MoreActionButton: FC<IMoreActionButtonProps> = (props) => {
  const { agentID, agentName, publishToMarketplace, isMobile, agentIcon } =
    props
  const { t } = useTranslation()
  const [shareVisible, setShareVisible] = useState(false)
  const dispatch = useDispatch()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const currentUser = useSelector(getCurrentUser)
  const navigateToEditTipis = useNavigateToEditTipis()
  const navigateToTipiDetails = useNavigateToTipiDetail()

  const canInvite = canManageInvite(
    currentTeamInfo.myRole,
    currentTeamInfo.permission.allowEditorManageTeamMember,
    currentTeamInfo.permission.allowViewerManageTeamMember,
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
        navigateToEditTipis(agentID)
        break
      }
      case "detail": {
        navigateToTipiDetails({
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
              currentTeamInfo.myRole,
              getPlanUtils(currentTeamInfo),
              currentTeamInfo.totalTeamLicense?.teamLicensePurchased,
              currentTeamInfo.totalTeamLicense?.teamLicenseAllPaid,
            )}
            title={t("user_management.modal.social_media.default_text.agent", {
              agentName: agentName,
            })}
            redirectURL={`${getILLACloudURL(window.customDomain)}/${
              currentTeamInfo.identifier
            }/ai-agent/${agentID}/run?myTeamIdentifier=${currentTeamInfo.identifier}`}
            onClose={() => {
              setShareVisible(false)
            }}
            canInvite={canInvite}
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
              copyToClipboard(
                t("user_management.modal.custom_copy_text_agent_invite", {
                  userName: currentUser.nickname,
                  teamName: currentTeamInfo.name,
                  inviteLink: link,
                }),
              )
            }}
            onCopyAgentMarketLink={(link) => {
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
              currentTeamInfo.myRole,
              getPlanUtils(currentTeamInfo),
              currentTeamInfo.totalTeamLicense?.teamLicensePurchased,
              currentTeamInfo.totalTeamLicense?.teamLicenseAllPaid,
            )}
            title={t("user_management.modal.social_media.default_text.agent", {
              agentName: agentName,
            })}
            redirectURL={`${getILLACloudURL()}${getRunTipiPath(currentTeamInfo.identifier, agentID)}`}
            onClose={() => {
              setShareVisible(false)
            }}
            canInvite={canInvite}
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
              copyToClipboard(
                t("user_management.modal.custom_copy_text_agent_invite", {
                  userName: currentUser.nickname,
                  teamName: currentTeamInfo.name,
                  inviteLink: link,
                }),
              )
            }}
            onCopyAgentMarketLink={(link) => {
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
            onShare={(platform) => {}}
            teamPlan={getPlanUtils(currentTeamInfo)}
          />
        ))}
    </>
  )
}

export default MoreActionButton
