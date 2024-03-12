import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import InviteIcon from "@/assets/workspace/invite.svg?react"
import TeamSelect from "../../components/TeamSelect"
import { teamSelectAndInviteButtonContainerStyle } from "./style"

const TeamSelectAndInviteButton: FC = () => {
  return (
    <div css={teamSelectAndInviteButtonContainerStyle}>
      <TeamSelect />
      <Button icon={<Icon component={InviteIcon} />} type="text" />
    </div>
  )
}

export default TeamSelectAndInviteButton
