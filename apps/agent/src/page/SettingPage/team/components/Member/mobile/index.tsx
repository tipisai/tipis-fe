import { Button } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { InviteMemberMobile } from "@illa-public/invite-modal"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import { teamActions } from "@illa-public/user-data"
import { canManageInvite, showInviteModal } from "@illa-public/user-role-utils"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MemberContext } from "../context"
import { MobileMemberList } from "./List"
import { mobileMemberContainerStyle, mobileTitleStyle } from "./style"

export const MobileMemberPage: FC = () => {
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!
  const dispatch = useDispatch()
  const currentUserRole = teamInfo?.myRole ?? USER_ROLE.VIEWER
  const {
    handleClickInviteButton,
    handleCopy,
    inviteModalVisible,
    closeInviteModal,
  } = useContext(MemberContext)

  return (
    <div css={mobileMemberContainerStyle}>
      <h1 css={mobileTitleStyle}>{t("user_management.page.member")}</h1>
      <MobileMemberList />
      {showInviteModal(teamInfo) && (
        <Button
          style={{
            width: 200,
          }}
          type="primary"
          size="large"
          onClick={handleClickInviteButton}
        >
          {t("homepage.workspace.invite")}
        </Button>
      )}
      {inviteModalVisible && (
        <InviteMemberMobile
          itemID={teamInfo.id}
          redirectURL=""
          onClose={closeInviteModal}
          canInvite={canManageInvite(
            teamInfo.myRole,
            teamInfo.permission.allowEditorManageTeamMember,
            teamInfo.permission.allowViewerManageTeamMember,
          )}
          currentUserRole={currentUserRole}
          defaultAllowInviteLink={teamInfo.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.VIEWER}
          defaultBalance={teamInfo.totalTeamLicense.balance}
          onCopyInviteLink={handleCopy}
          onInviteLinkStateChange={(isInviteLink) => {
            dispatch(
              teamActions.updateTeamMemberPermissionReducer({
                teamID: teamInfo.id,
                newPermission: {
                  ...teamInfo.permission,
                  inviteLinkEnabled: isInviteLink,
                },
              }),
            )
          }}
          teamID={teamInfo.id}
          onBalanceChange={() => {}}
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
    </div>
  )
}

export default MobileMemberPage
