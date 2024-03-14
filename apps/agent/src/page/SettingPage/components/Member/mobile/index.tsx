import { Button } from "antd"
import { FC, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { InviteMemberMobile } from "@illa-public/invite-modal"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import { getCurrentTeamInfo, teamActions } from "@illa-public/user-data"
import { canManageInvite, showInviteModal } from "@illa-public/user-role-utils"
import { MemberContext } from "../context"
import { MobileMemberList } from "./List"
import { mobileMemberContainerStyle, mobileTitleStyle } from "./style"

export const MobileMemberPage: FC = () => {
  const { t } = useTranslation()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const dispatch = useDispatch()
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const currentUserRole = teamInfo?.myRole ?? USER_ROLE.VIEWER
  const { track } = useContext(MixpanelTrackContext)
  const {
    showInviteButton,
    handleClickInviteButton,
    handleCopy,
    inviteModalVisible,
    closeInviteModal,
  } = useContext(MemberContext)

  useEffect(() => {
    showInviteButton &&
      track?.(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
        element: "invite_entry",
      })
  }, [showInviteButton, track])

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
            currentTeamInfo.myRole,
            currentTeamInfo.permission.allowEditorManageTeamMember,
            currentTeamInfo.permission.allowViewerManageTeamMember,
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
          //TODO: WTF not limit invite
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
