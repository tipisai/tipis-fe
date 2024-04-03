import { Button } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import {
  InviteMember,
  InviteMemberProvider,
} from "@illa-public/new-invite-modal"
import { USER_ROLE } from "@illa-public/public-types"
import { showInviteModal } from "@illa-public/user-role-utils"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { MemberContext } from "../context"
import { MobileMemberList } from "./List"
import { mobileMemberContainerStyle, mobileTitleStyle } from "./style"

export const MobileMemberPage: FC = () => {
  const { t } = useTranslation()
  const currentTeamInfo = useGetCurrentTeamInfo()!

  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER
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
      {showInviteModal(currentTeamInfo) && (
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
    </div>
  )
}

export default MobileMemberPage
