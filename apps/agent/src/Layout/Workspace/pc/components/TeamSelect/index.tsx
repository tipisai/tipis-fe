import Icon from "@ant-design/icons"
import { Avatar } from "antd"
import { FC } from "react"
import { useSelector } from "react-redux"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import UpAndDownArrowIcon from "@/assets/workspace/upAndDownArrow.svg?react"
import {
  iconContainerStyle,
  teamAvatarContainerStyle,
  teamNameStyle,
  teamSelectContainerStyle,
} from "./style"

const TeamSelect: FC = () => {
  const currentTeam = useSelector(getCurrentTeamInfo)!
  return (
    <div css={teamSelectContainerStyle}>
      <div css={teamAvatarContainerStyle}>
        <Avatar src={currentTeam.icon} size={24} shape="square" />
      </div>
      <span css={teamNameStyle}>Walmart</span>
      <div css={iconContainerStyle}>
        <Icon component={UpAndDownArrowIcon} />
      </div>
    </div>
  )
}

export default TeamSelect
