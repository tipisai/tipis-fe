import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ShareIcon } from "@illa-public/icon"
import {
  InviteMember,
  InviteMemberProvider,
} from "@illa-public/new-invite-modal"
import { USER_ROLE } from "@illa-public/public-types"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import { copyToClipboard } from "@/utils/copyToClipboard"
import { getEditTipiPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IAgentForm } from "../../interface"

const ShareButton: FC = () => {
  const { control } = useFormContext<IAgentForm>()
  const [aiAgentID] = useWatch({
    control: control,
    name: ["aiAgentID"],
  })

  const currentTeamInfo = useGetCurrentTeamInfo()!
  const currentUserRole = currentTeamInfo?.myRole ?? USER_ROLE.VIEWER
  const { data: currentUserInfo } = useGetUserInfoQuery(null)

  const [shareDialogVisible, setShareDialogVisible] = useState(false)

  const { t } = useTranslation()

  const onShowShareDialog = () => {
    setShareDialogVisible(true)
  }

  return (
    <>
      <Button
        size="large"
        disabled={!aiAgentID}
        icon={<Icon component={ShareIcon} />}
        onClick={onShowShareDialog}
      >
        {t("share")}
      </Button>
      {shareDialogVisible && currentTeamInfo && currentUserInfo && (
        <InviteMemberProvider
          defaultAllowInviteLink={currentTeamInfo.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.EDITOR}
          teamID={currentTeamInfo?.id ?? ""}
          currentUserRole={currentUserRole}
        >
          <InviteMember
            redirectURL={`${getILLACloudURL()}${getEditTipiPath(currentTeamInfo.identifier, aiAgentID)}`}
            excludeUserRole={[USER_ROLE.VIEWER]}
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
              setShareDialogVisible(false)
            }}
          />
        </InviteMemberProvider>
      )}
    </>
  )
}

ShareButton.displayName = "ShareButton"

export default ShareButton
