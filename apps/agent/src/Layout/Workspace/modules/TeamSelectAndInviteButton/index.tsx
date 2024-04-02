import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { InviteMemberMobile, InviteMemberPC } from "@illa-public/invite-modal"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import { getCurrentUser, teamActions } from "@illa-public/user-data"
import { canManageInvite } from "@illa-public/user-role-utils"
import InviteIcon from "@/assets/workspace/invite.svg?react"
import TeamSelect from "@/components/TeamSelect"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { getChatPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import {
  inviteButtonContainerStyle,
  teamSelectAndInviteButtonContainerStyle,
} from "./style"

const TeamSelectAndInviteButton: FC = () => {
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const currentTeamInfo = useGetCurrentTeamInfo()
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const userInfo = useSelector(getCurrentUser)
  const navigate = useNavigate()

  const handleClickInvite = () => {
    setInviteModalVisible(true)
  }

  const handleSwitchTeam = (teamID: string, teamIdentifier: string) => {
    navigate(getChatPath(teamIdentifier))
  }

  return (
    <>
      <div css={teamSelectAndInviteButtonContainerStyle}>
        <TeamSelect showCreateTeamButton onChangeTeam={handleSwitchTeam} />
        <div css={inviteButtonContainerStyle}>
          <Button
            icon={<Icon component={InviteIcon} />}
            type="text"
            onClick={handleClickInvite}
          />
        </div>
      </div>
      {inviteModalVisible && (
        <LayoutAutoChange
          desktopPage={
            <InviteMemberPC
              itemID={currentTeamInfo!.id}
              redirectURL=""
              onClose={() => setInviteModalVisible(false)}
              canInvite={canManageInvite(
                currentTeamInfo?.myRole ?? USER_ROLE.VIEWER,
                currentTeamInfo?.permission.allowEditorManageTeamMember,
                currentTeamInfo?.permission.allowViewerManageTeamMember,
              )}
              currentUserRole={currentUserRole}
              defaultAllowInviteLink={
                currentTeamInfo?.permission.inviteLinkEnabled ?? false
              }
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
                    teamID: currentTeamInfo?.id ?? "",
                    newPermission: {
                      ...currentTeamInfo?.permission,
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
          }
          mobilePage={
            <InviteMemberMobile
              itemID={currentTeamInfo!.id}
              redirectURL=""
              onClose={() => setInviteModalVisible(false)}
              canInvite={canManageInvite(
                currentTeamInfo!.myRole,
                currentTeamInfo!.permission.allowEditorManageTeamMember,
                currentTeamInfo!.permission.allowViewerManageTeamMember,
              )}
              currentUserRole={currentUserRole}
              defaultAllowInviteLink={
                currentTeamInfo!.permission.inviteLinkEnabled
              }
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
          }
        />
      )}
    </>
  )
}

export default TeamSelectAndInviteButton
