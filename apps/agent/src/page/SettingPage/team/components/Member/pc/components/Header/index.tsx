import { Button } from "antd"
import { FC, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { InviteMemberPC } from "@illa-public/invite-modal"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { MemberInfo, USER_ROLE, USER_STATUS } from "@illa-public/public-types"
import { getCurrentTeamInfo, teamActions } from "@illa-public/user-data"
import {
  canManageInvite,
  isBiggerThanTargetRole,
} from "@illa-public/user-role-utils"
import { MemberContext } from "../../../context"
import { MoreAction } from "./moreAction"
import { buttonGroup, headerWrapperStyle, titleStyle } from "./style"

export const Header: FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const teamInfo = useSelector(getCurrentTeamInfo)!!
  const currentUserRole = teamInfo?.myRole ?? USER_ROLE.VIEWER
  const { track } = useContext(MixpanelTrackContext)
  const {
    showInviteButton,
    inviteModalVisible,
    handleClickInviteButton,
    handleCopy,
    closeInviteModal,
  } = useContext(MemberContext)

  useEffect(() => {
    showInviteButton &&
      track?.(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
        element: "invite_entry",
      })
  }, [showInviteButton, track])

  return (
    <>
      <div css={headerWrapperStyle}>
        <h1 css={titleStyle}>{t("user_management.page.member")}</h1>
        <div css={buttonGroup}>
          {isBiggerThanTargetRole(USER_ROLE.EDITOR, currentUserRole, false) && (
            <MoreAction />
          )}
          {showInviteButton && (
            <Button
              type="primary"
              style={{
                width: 200,
              }}
              onClick={handleClickInviteButton}
            >
              {t("user_management.page.invite")}
            </Button>
          )}
        </div>
      </div>
      {inviteModalVisible && (
        <InviteMemberPC
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
          defaultBalance={teamInfo?.totalTeamLicense?.balance}
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
          // TODO: WTF, not limit invite
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
    </>
  )
}
