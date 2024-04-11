import Icon from "@ant-design/icons"
import { App, Button, Dropdown, List, MenuProps, Tag } from "antd"
import { FC, MouseEventHandler, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
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
import {
  InviteMember,
  InviteMemberProvider,
} from "@illa-public/new-invite-modal"
import { USER_ROLE } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import {
  getCurrentId,
  getCurrentTeamInfo,
  useGetUserInfoQuery,
} from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import TeamCard from "@/components/TeamCard"
import {
  useDeleteAIAgentMutation,
  useDuplicateAIAgentMutation,
} from "@/redux/services/agentAPI"
import {
  canShowShareTipi,
  canShownCreateTipi,
  canShownEditTipi,
} from "@/utils/UIHelper/tipis"
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
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const navigate = useNavigate()
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

  const onClickEditButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    TipisTrack.track("click_edit_tipi_entry", {
      parameter1: "dashboard",
    })
    navigateToEditTIpis(id)
  }

  const onClickRunButton: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    TipisTrack.track("click_run_tipi_entry", {
      parameter1: "dashboard",
    })
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
    const originMenuItems: MenuProps["items"] = []
    if (canShownCreateTipi(currentTeamInfo)) {
      originMenuItems.push({
        label: t("dashboard.common.duplicate"),
        key: "duplicate",
        icon: <Icon component={CopyIcon} />,
      })
    }
    if (canShowShareTipi(currentTeamInfo)) {
      originMenuItems.push({
        label: t("dashboard.common.share"),
        key: "share",
        icon: <Icon component={ShareIcon} />,
      })
    }

    if (canShownCreateTipi(currentTeamInfo)) {
      originMenuItems.push({
        label: t("dashboard.common.delete"),
        key: "delete",
        danger: true,
        icon: <Icon component={DeleteIcon} />,
      })
    }
    return originMenuItems
  }, [currentTeamInfo, t])

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
            menuItems.length > 0 && (
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
            )
          }
          editButton={
            <>
              {canShownEditTipi(currentTeamInfo) && (
                <Button
                  type="text"
                  icon={<Icon component={PenIcon} />}
                  onClick={onClickEditButton}
                >
                  {t("dashboard.common.edit")}
                </Button>
              )}
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

      {shareVisible && currentTeamInfo && currentUserInfo && (
        <InviteMemberProvider
          defaultAllowInviteLink={currentTeamInfo.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.VIEWER}
          teamID={currentTeamInfo?.id ?? ""}
          currentUserRole={currentUserRole}
        >
          <InviteMember
            redirectURL={`${getILLACloudURL()}${getRunTipiPath(currentTeamInfo.identifier, id, v4())}`}
            onCopyInviteLink={(link) => {
              copyToClipboard(
                t("user_management.modal.custom_copy_text_agent_invite", {
                  userName: currentUserInfo.nickname,
                  teamName: currentTeamInfo.name,
                  inviteLink: link,
                }),
              )
            }}
            onClose={() => {
              setShareVisible(false)
            }}
          />
        </InviteMemberProvider>
      )}
    </>
  )
}

export default PCTeamCardListItem
