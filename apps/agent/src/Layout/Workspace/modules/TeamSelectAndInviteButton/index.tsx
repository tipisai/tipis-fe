import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { InviteMemberPC } from "@illa-public/invite-modal"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  getCurrentUser,
  teamActions,
} from "@illa-public/user-data"
import { canManageInvite } from "@illa-public/user-role-utils"
import InviteIcon from "@/assets/workspace/invite.svg?react"
import TeamSelect from "@/components/TeamSelect"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { track } from "@/utils/mixpanelHelper"
import { getChatPath } from "@/utils/routeHelper"
import {
  inviteButtonContainerStyle,
  teamSelectAndInviteButtonContainerStyle,
} from "./style"

interface TeamSelectAndInviteButton {
  openCreateModal: () => void
}

const TeamSelectAndInviteButton: FC<TeamSelectAndInviteButton> = ({
  openCreateModal,
}) => {
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userInfo = useSelector(getCurrentUser)
  const navigate = useNavigate()

  const handleClickInvite = () => {
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.HOMEPAGE,
      { element: "invite_entry" },
    )
    setInviteModalVisible(true)
  }

  const handleSwitchTeam = (teamID: string, teamIdentifier: string) => {
    navigate(getChatPath(teamIdentifier))
  }

  return (
    <>
      <div css={teamSelectAndInviteButtonContainerStyle}>
        <TeamSelect
          openCreateModal={openCreateModal}
          showCreateTeamButton
          onChangeTeam={handleSwitchTeam}
        />
        <div css={inviteButtonContainerStyle}>
          <Button
            icon={<Icon component={InviteIcon} />}
            type="text"
            onClick={handleClickInvite}
          />
        </div>
      </div>
      {inviteModalVisible && (
        <InviteMemberPC
          itemID={currentTeamInfo!.id}
          redirectURL=""
          onClose={() => setInviteModalVisible(false)}
          canInvite={canManageInvite(
            currentTeamInfo!.myRole,
            currentTeamInfo!.permission.allowEditorManageTeamMember,
            currentTeamInfo!.permission.allowViewerManageTeamMember,
          )}
          currentUserRole={currentUserRole}
          defaultAllowInviteLink={currentTeamInfo!.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.VIEWER}
          defaultBalance={currentTeamInfo?.totalTeamLicense?.balance ?? 0}
          onCopyInviteLink={(link: string) => {
            copyToClipboard(
              t("user_management.modal.custom_copy_text", {
                inviteLink: link,
                teamName: currentTeamInfo?.name,
                userName: userInfo.nickname,
              }),
            )
          }}
          onInviteLinkStateChange={(isInviteLink) => {
            dispatch(
              teamActions.updateTeamMemberPermissionReducer({
                teamID: currentTeamInfo!.id,
                newPermission: {
                  ...currentTeamInfo!.permission,
                  inviteLinkEnabled: isInviteLink,
                },
              }),
            )
          }}
          teamID={currentTeamInfo!.id}
          onBalanceChange={(balance) => {
            dispatch(
              teamActions.updateTeamMemberSubscribeReducer({
                teamID: currentTeamInfo!.id,
                subscribeInfo: {
                  ...currentTeamInfo!.currentTeamLicense,
                  balance: balance,
                },
              }),
            )
          }}
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
        />
      )}
    </>
  )
}

export default TeamSelectAndInviteButton
