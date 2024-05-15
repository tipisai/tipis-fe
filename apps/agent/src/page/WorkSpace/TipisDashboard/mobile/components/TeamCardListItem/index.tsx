import Icon from "@ant-design/icons"
import {
  App,
  Button,
  ConfigProvider,
  Dropdown,
  List,
  MenuProps,
  Tag,
} from "antd"
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
  PinIcon,
  ShareIcon,
  UnPinIcon,
} from "@illa-public/icon"
import {
  InviteMember,
  InviteMemberProvider,
} from "@illa-public/new-invite-modal"
import { USER_ROLE } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentTeamInfo, useGetUserInfoQuery } from "@illa-public/user-data"
import { copyToClipboard, getILLACloudURL } from "@illa-public/utils"
import MobileTeamCard from "@/components/TeamCard/mobile"
import {
  useDeleteAIAgentMutation,
  useDuplicateAIAgentMutation,
} from "@/redux/services/agentAPI"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { canShowShareTipi, canShownCreateTipi } from "@/utils/UIHelper/tipis"
import {
  useAddPinedTipiTabReducer,
  useRemovePinedTipiTabByTipiIDReducer,
} from "@/utils/pinedTabs/baseHook"
import { getEditTipiPath, getRunTipiPath } from "@/utils/routeHelper"
import {
  useNavigateToEditTipis,
  useNavigateToRunTipis,
} from "@/utils/routeHelper/hook"
import { ITeamCardListItemProps } from "../../../components/TeamCardList/interface"
import {
  dropdownMenuItemContainerStyle,
  dropdownMenuItemIconStyle,
} from "./style"

const MobileTeamCardListItem: FC<ITeamCardListItemProps> = (props) => {
  const { icon, title, description, id, publishToMarketplace } = props

  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { t } = useTranslation()

  const { teamIdentifier } = useParams()

  const { modal, message } = App.useApp()
  const [shareVisible, setShareVisible] = useState(false)
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER

  const pinedInfos = useSelector((state) => getPinedTipisByTipisID(state, id))
  const isPined = !!pinedInfos

  const [isMoreActionDropdownOpen, setIsMoreActionDropdownOpen] =
    useState(false)

  const tags = publishToMarketplace ? (
    <Tag color="purple">Marketplace</Tag>
  ) : undefined

  const navigate = useNavigate()
  const navigateRunTipis = useNavigateToRunTipis()
  const navigateToEditTIpis = useNavigateToEditTipis()
  const [duplicateAIAgent] = useDuplicateAIAgentMutation()
  const [deleteAIAgent] = useDeleteAIAgentMutation()
  const addPinedTipis = useAddPinedTipiTabReducer()
  const removePinedTipiByTipisID = useRemovePinedTipiTabByTipiIDReducer()

  const onClickCard = () => {
    TipisTrack.track("click_run_tipi_entry", {
      parameter1: "dashboard",
    })
    navigateRunTipis(
      {
        tipisID: id,
        tipisIcon: icon,
        tipisName: title,
      },
      v4(),
    )
  }

  const menuItems: MenuProps["items"] = useMemo(() => {
    const originMenuItems: MenuProps["items"] = [
      {
        label: isPined
          ? t("dashboard.common.unpin")
          : t("dashboard.common.pin"),
        key: isPined ? "unpin" : "pin",
        icon: <Icon component={isPined ? UnPinIcon : PinIcon} />,
      },
    ]
    if (canShownCreateTipi(currentTeamInfo)) {
      originMenuItems.push(
        {
          label: (
            <div css={dropdownMenuItemContainerStyle}>
              {t("dashboard.common.edit")}
            </div>
          ),
          key: "edit",
          icon: <Icon component={PenIcon} css={dropdownMenuItemIconStyle} />,
        },
        {
          label: (
            <div css={dropdownMenuItemContainerStyle}>
              {t("dashboard.common.duplicate")}
            </div>
          ),
          key: "duplicate",
          icon: <Icon component={CopyIcon} />,
        },
      )
    }
    if (canShowShareTipi(currentTeamInfo)) {
      originMenuItems.push({
        label: (
          <div css={dropdownMenuItemContainerStyle}>
            {t("dashboard.common.share")}
          </div>
        ),
        key: "share",
        icon: <Icon component={ShareIcon} />,
      })
    }

    if (canShownCreateTipi(currentTeamInfo)) {
      originMenuItems.push({
        label: (
          <div css={dropdownMenuItemContainerStyle}>
            {t("dashboard.common.delete")}
          </div>
        ),
        key: "delete",
        danger: true,
        icon: <Icon component={DeleteIcon} />,
      })
    }
    return originMenuItems
  }, [currentTeamInfo, isPined, t])

  const onClickMenuItem: MenuProps["onClick"] = async ({ key, domEvent }) => {
    domEvent.stopPropagation()
    switch (key) {
      case "pin": {
        await addPinedTipis({
          tabID: v4(),
          tabName: title,
          tabIcon: icon,
          tipiID: id,
          tipiOwnerTeamIdentity: currentTeamInfo.identify,
        })
        break
      }
      case "unpin": {
        await removePinedTipiByTipisID(id)
        break
      }
      case "edit": {
        TipisTrack.track("click_edit_tipi_entry", {
          parameter1: "dashboard",
        })
        navigateToEditTIpis({
          tipisID: id,
          tipisName: title,
        })
        break
      }
      case "duplicate":
        {
          try {
            const agentDetail = await duplicateAIAgent({
              teamID: currentTeamInfo.id,
              aiAgentID: id,
            }).unwrap()
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
                teamID: currentTeamInfo.id,
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

  const onClickMoreAction: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    setIsMoreActionDropdownOpen(true)
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            paddingLG: 16,
          },
        },
      }}
    >
      <List.Item>
        <MobileTeamCard
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
            redirectURL={`${getILLACloudURL()}${getRunTipiPath(currentTeamInfo.identify, id, v4())}`}
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
    </ConfigProvider>
  )
}

export default MobileTeamCardListItem
