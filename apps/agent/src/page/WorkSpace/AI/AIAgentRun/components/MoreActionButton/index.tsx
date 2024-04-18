import Icon from "@ant-design/icons"
import { Button, Dropdown, MenuProps } from "antd"
import { FC, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import {
  InfoIcon,
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
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { canShowShareTipi, canShownEditTipi } from "@/utils/UIHelper/tipis"
import { copyToClipboard } from "@/utils/copyToClipboard"
import {
  useAddPinedTipiTabReducer,
  useRemovePinedTipiTabByTipiIDReducer,
} from "@/utils/pinedTabs/baseHook"
import { getRunTipiPath } from "@/utils/routeHelper"
import {
  useNavigateToEditTipis,
  useNavigateToTipiDetail,
} from "@/utils/routeHelper/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IMoreActionButtonProps } from "./interface"

const MoreActionButton: FC<IMoreActionButtonProps> = (props) => {
  const { agentID, agentName, isMobile, agentIcon, ownerTeamIdentifier } = props
  const { t } = useTranslation()
  const [shareVisible, setShareVisible] = useState(false)
  const currentTeamInfo = useGetCurrentTeamInfo()
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER
  const pinedInfos = useSelector((state) =>
    getPinedTipisByTipisID(state, agentID),
  )

  const isPined = !!pinedInfos

  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const navigateToEditTipis = useNavigateToEditTipis()
  const navigateToTipiDetails = useNavigateToTipiDetail()
  const addPinedTipis = useAddPinedTipiTabReducer()
  const removePinedTipiByTipisID = useRemovePinedTipiTabByTipiIDReducer()

  const items: MenuProps["items"] = useMemo(() => {
    const originMenuItems: MenuProps["items"] = [
      {
        label: isPined
          ? t("dashboard.common.unpin")
          : t("dashboard.common.pin"),
        key: isPined ? "unpin" : "pin",
        icon: <Icon component={isPined ? UnPinIcon : PinIcon} />,
      },
    ]
    if (canShownEditTipi(currentTeamInfo)) {
      originMenuItems.push({
        key: "edit",
        label: t("dashboard.common.edit"),
        icon: <Icon component={PenIcon} />,
      })
    }

    if (canShowShareTipi(currentTeamInfo)) {
      originMenuItems.push({
        key: "share",
        label: t("share"),
        icon: <Icon component={ShareIcon} />,
      })
    }
    originMenuItems.push({
      key: "detail",
      label: t("homepage.run_tipi.more.detail"),
      icon: <Icon component={InfoIcon} />,
    })
    return originMenuItems
  }, [currentTeamInfo, isPined, t])

  const onClickMenuItem: MenuProps["onClick"] = async ({ key, domEvent }) => {
    domEvent.stopPropagation()
    TipisTrack.track("click_more", {
      parameter1: "run",
    })
    switch (key) {
      case "pin": {
        await addPinedTipis({
          tabID: v4(),
          tabName: agentName,
          tabIcon: agentIcon,
          tipiID: agentID,
          tipiOwnerTeamIdentity: ownerTeamIdentifier,
        })
        break
      }
      case "unpin": {
        await removePinedTipiByTipisID(agentID)
        break
      }
      case "share":
        {
          setShareVisible(true)
        }
        break
      case "edit": {
        TipisTrack.track("click_edit_tipi_entry", {
          parameter1: "run",
        })
        navigateToEditTipis({
          tipisID: agentID,
          tipisName: agentName,
        })
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
      {shareVisible && currentTeamInfo && currentUserInfo && (
        <InviteMemberProvider
          defaultAllowInviteLink={currentTeamInfo.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.VIEWER}
          teamID={currentTeamInfo?.id ?? ""}
          currentUserRole={currentUserRole}
        >
          <InviteMember
            redirectURL={`${getILLACloudURL()}${getRunTipiPath(currentTeamInfo.identifier, agentID, v4())}`}
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

export default MoreActionButton
