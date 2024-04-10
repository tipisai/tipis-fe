import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  InviteMember,
  InviteMemberProvider,
} from "@illa-public/new-invite-modal"
import { USER_ROLE } from "@illa-public/public-types"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import InviteIcon from "@/assets/workspace/invite.svg?react"
import TeamSelect from "@/components/TeamSelect"
import { canShowShareTipi } from "@/utils/UIHelper/tipis"
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
  const { data: currentUserInfo } = useGetUserInfoQuery(null)

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
        {canShowShareTipi(currentTeamInfo) && (
          <div css={inviteButtonContainerStyle}>
            <Button
              icon={<Icon component={InviteIcon} />}
              type="text"
              onClick={handleClickInvite}
            />
          </div>
        )}
      </div>
      {inviteModalVisible && currentTeamInfo && currentUserInfo && (
        <InviteMemberProvider
          defaultAllowInviteLink={currentTeamInfo.permission.inviteLinkEnabled}
          defaultInviteUserRole={USER_ROLE.VIEWER}
          teamID={currentTeamInfo?.id ?? ""}
          currentUserRole={currentUserRole}
        >
          <InviteMember
            redirectURL={""}
            onCopyInviteLink={(inviteLink) => {
              copyToClipboard(
                t("user_management.modal.custom_copy_text", {
                  inviteLink: inviteLink,
                  teamName: currentTeamInfo.name,
                  userName: currentUserInfo.nickname,
                }),
              )
            }}
            onClose={() => {
              setInviteModalVisible(false)
            }}
          />
        </InviteMemberProvider>
      )}
    </>
  )
}

export default TeamSelectAndInviteButton
