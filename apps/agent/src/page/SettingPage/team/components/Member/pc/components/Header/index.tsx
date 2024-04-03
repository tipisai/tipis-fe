import { Button } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import {
  InviteMember,
  InviteMemberProvider,
} from "@illa-public/new-invite-modal"
import { USER_ROLE } from "@illa-public/public-types"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MemberContext } from "../../../context"
import { MoreAction } from "./moreAction"
import { buttonGroup, headerWrapperStyle, titleStyle } from "./style"

export const Header: FC = () => {
  const { t } = useTranslation()
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER
  const {
    showInviteButton,
    inviteModalVisible,
    handleClickInviteButton,
    handleCopy,
    closeInviteModal,
  } = useContext(MemberContext)

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
              size="large"
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
      {inviteModalVisible && currentTeamInfo && (
        <InviteMemberProvider
          defaultAllowInviteLink={currentTeamInfo.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.VIEWER}
          teamID={currentTeamInfo?.id ?? ""}
          currentUserRole={currentUserRole}
        >
          <InviteMember
            redirectURL={""}
            onCopyInviteLink={handleCopy}
            onClose={closeInviteModal}
          />
        </InviteMemberProvider>
      )}
    </>
  )
}
