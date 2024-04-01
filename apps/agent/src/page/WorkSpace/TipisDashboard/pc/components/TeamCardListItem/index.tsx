import Icon from "@ant-design/icons"
import { App, Button, Dropdown, List, MenuProps, Tag } from "antd"
import { FC, MouseEventHandler, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { v4 } from "uuid"
import {
  CopyIcon,
  DeleteIcon,
  MoreIcon,
  PenIcon,
  PlayFillIcon,
  ShareIcon,
} from "@illa-public/icon"
import { ShareAgentPC } from "@illa-public/invite-modal"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import {
  getCurrentId,
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
import TeamCard from "@/components/TeamCard"
import {
  useDeleteAIAgentMutation,
  useDuplicateAIAgentMutation,
} from "@/redux/services/agentAPI"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { getEditTipiPath, getRunTipiPath } from "@/utils/routeHelper"
import {
  useNavigateToEditTipis,
  useNavigateToRunTipis,
  useNavigateToTipiDetail,
} from "@/utils/routeHelper/hook"
import { ITeamCardListItemProps } from "../../../components/TeamCardList/interface"

const PCTeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, id, publishToMarketplace } = props
  const { modal, message } = App.useApp()
  const { t } = useTranslation()

  const { teamIdentifier } = useParams()

  const currentTeamID = useSelector(getCurrentId)!
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const currentUser = useSelector(getCurrentUser)

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const navigateToEditTIpis = useNavigateToEditTipis()
  const navigateRunTipis = useNavigateToRunTipis()
  const navigateToTipiDetails = useNavigateToTipiDetail()
  const [shareVisible, setShareVisible] = useState(false)

  const onClickCard = () => {
    navigateToTipiDetails({
      tipisID: id,
      title: title,
      tabIcon: icon,
    })
  }

  const [duplicateAIAgent] = useDuplicateAIAgentMutation()
  const [deleteAIAgent] = useDeleteAIAgentMutation()

  const [isMoreActionDropdownOpen, setIsMoreActionDropdownOpen] =
    useState(false)

  const canInvite = canManageInvite(
    currentTeamInfo.myRole,
    currentTeamInfo.permission.allowEditorManageTeamMember,
    currentTeamInfo.permission.allowViewerManageTeamMember,
  )

  const onClickEditButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    navigateToEditTIpis(id)
  }

  const onClickRunButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    navigateRunTipis(
      {
        tipisID: id,
        tipisName: title,
        tipisIcon: icon,
      },
      v4(),
    )
  }

  const onClickMoreAction: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    setIsMoreActionDropdownOpen(true)
  }

  const onClickMenuItem: MenuProps["onClick"] = async ({ key, domEvent }) => {
    domEvent.stopPropagation()
    switch (key) {
      case "duplicate":
        {
          try {
            const agentDetail = await duplicateAIAgent({
              teamID: currentTeamID,
              aiAgentID: id,
            }).unwrap()
            // TODO: open newTab
            navigate(getEditTipiPath(teamIdentifier!, agentDetail.aiAgentID))
          } catch {
            message.error({
              content: t("dashboard.app.duplicate_fail"),
            })
          }
        }
        break
      case "share":
        {
          setShareVisible(true)
        }
        break
      case "delete":
        {
          modal.confirm({
            title: t("dashboard.common.delete_title"),
            content: t("dashboard.common.delete_content"),
            cancelText: t("dashboard.common.delete_cancel_text"),
            okText: t("dashboard.common.delete_ok_text"),
            okButtonProps: {
              type: "primary",
              danger: true,
            },
            onOk: () => {
              deleteAIAgent({
                teamID: currentTeamID,
                aiAgentID: id,
              })
            },
          })
        }
        break
      default:
        break
    }
  }

  const menuItems: MenuProps["items"] = useMemo(() => {
    return [
      {
        label: t("dashboard.common.duplicate"),
        key: "duplicate",
        icon: <Icon component={CopyIcon} />,
      },
      {
        label: t("dashboard.common.share"),
        key: "share",
        icon: <Icon component={ShareIcon} />,
      },
      {
        label: t("dashboard.common.delete"),
        key: "delete",
        danger: true,
        icon: <Icon component={DeleteIcon} />,
      },
    ]
  }, [t])

  return (
    <>
      <List.Item>
        <TeamCard
          icon={icon}
          title={title}
          description={description}
          tags={tags}
          onClickCard={onClickCard}
          moreButton={
            <Dropdown
              open={isMoreActionDropdownOpen}
              onOpenChange={setIsMoreActionDropdownOpen}
              trigger={["click"]}
              menu={{
                items: menuItems,
                onClick: onClickMenuItem,
              }}
            >
              <Button
                type="text"
                icon={<Icon component={MoreIcon} />}
                onClick={onClickMoreAction}
              />
            </Dropdown>
          }
          editButton={
            <>
              <Button
                type="text"
                icon={<Icon component={PenIcon} />}
                onClick={onClickEditButton}
              >
                {t("dashboard.common.edit")}
              </Button>
              <Button
                type="text"
                icon={<Icon component={PlayFillIcon} />}
                onClick={onClickRunButton}
              >
                {t("dashboard.common.run")}
              </Button>
            </>
          }
        />
      </List.Item>
      <>
        {shareVisible && (
          <ShareAgentPC
            itemID={id}
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
              agentName: title,
            })}
            redirectURL={`${getILLACloudURL()}${getRunTipiPath(currentTeamInfo.identifier, id)}`}
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
            agentID={id}
            defaultAgentContributed={publishToMarketplace}
            onAgentContributed={(isAgentContributed) => {
              if (isAgentContributed) {
                const newUrl = new URL(getAgentPublicLink(id))
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
                  agentName: title,
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
        )}
      </>
    </>
  )
}

export default PCTeamCardListItem
