import { App } from "antd"
import { FC, useCallback, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router-dom"
import { ERROR_FLAG, isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  useChangeTeamMemberRoleMutation,
  useGetMemberListQuery,
  useGetUserInfoQuery,
} from "@illa-public/user-data"
import { showInviteModal } from "@illa-public/user-role-utils"
import { COPY_STATUS, copyToClipboard } from "@illa-public/utils"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MemberContext } from "./context"
import MobileMemberPage from "./mobile"
import PCMemberPage from "./pc"

export const MemberListPage: FC = () => {
  const { t } = useTranslation()
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const teamInfo = useGetCurrentTeamInfo()!
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const { message } = App.useApp()
  const { track } = useContext(MixpanelTrackContext)
  const showInviteButton = showInviteModal(teamInfo)

  const {
    data: memberList,
    isError,
    isLoading,
  } = useGetMemberListQuery(teamInfo.id, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
  })

  const [changeTeamMembersRole] = useChangeTeamMemberRoleMutation()

  const handleChangeTeamMembersRole = useCallback(
    async (teamMemberID: string, userRole: USER_ROLE) => {
      try {
        await changeTeamMembersRole({
          teamID: teamInfo.id,
          teamMemberID,
          userRole,
        })
        message.success({
          content: t("user_management.mes.change_role_suc"),
        })
      } catch (error) {
        if (isILLAAPiError(error)) {
          switch (error.data.errorFlag) {
            case ERROR_FLAG.ERROR_FLAG_ACCESS_DENIED:
            case ERROR_FLAG.ERROR_FLAG_CAN_NOT_INCREASE_TEAM_MEMBER_DUE_TO_NO_BALANCE:
              message.error({
                content: t("user_management.mes.change_role_fail"),
              })
              break
            default:
              if (userRole === USER_ROLE.OWNER) {
                message.error({
                  content: t("user_management.mes.transfer_fail"),
                })
              } else {
                message.error({
                  content: t("user_management.mes.change_role_fail"),
                })
              }
              break
          }
        }
      }
    },
    [changeTeamMembersRole, teamInfo.id, message, t],
  )

  const handleClickInviteButton = useCallback(() => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "invite_entry",
    })
    setInviteModalVisible(true)
  }, [track])

  const handleCopy = useCallback(
    (inviteLink: string) => {
      const flag = copyToClipboard(
        t("user_management.modal.custom_copy_text", {
          inviteLink: inviteLink,
          teamName: teamInfo.name,
          userName: currentUserInfo?.nickname,
        }),
      )
      if (flag === COPY_STATUS.EMPTY) {
        message.info({
          content: t("empty_copied_tips"),
        })
      } else {
        message.success({
          content: t("copied"),
        })
      }
    },
    [currentUserInfo?.nickname, message, t, teamInfo.name],
  )

  if (isError) return <Navigate to="/500" />
  if (isLoading) return <FullSectionLoading />
  return Array.isArray(memberList) ? (
    <MemberContext.Provider
      value={{
        handleCopy,
        handleClickInviteButton,
        showInviteButton,
        inviteModalVisible,
        closeInviteModal: () => setInviteModalVisible(false),
        handleChangeTeamMembersRole,
      }}
    >
      <LayoutAutoChange
        desktopPage={<PCMemberPage />}
        mobilePage={<MobileMemberPage />}
      />
    </MemberContext.Provider>
  ) : null
}

export default MemberListPage
