import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import InviteIcon from "@/assets/workspace/invite.svg?react"
import TeamSelect from "@/components/TeamSelect"
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
  return (
    <div css={teamSelectAndInviteButtonContainerStyle}>
      <TeamSelect openCreateModal={openCreateModal} showCreateTeamButton />
      <div css={inviteButtonContainerStyle}>
        <Button icon={<Icon component={InviteIcon} />} type="text" />
      </div>
    </div>
  )
}

export default TeamSelectAndInviteButton
