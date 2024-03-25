import Icon from "@ant-design/icons"
import { Avatar, Popover } from "antd"
import { FC, useState } from "react"
import { useGetUserInfoAndTeamsInfoByTokenQuery } from "@illa-public/user-data"
import UpAndDownArrowIcon from "@/assets/workspace/upAndDownArrow.svg?react"
import TeamSelectContent from "./Content"
import { TeamSelectProps } from "./interface"
import {
  iconContainerStyle,
  teamAvatarContainerStyle,
  teamNameStyle,
  teamSelectContainerStyle,
} from "./style"

const TeamSelect: FC<TeamSelectProps> = (props) => {
  const [openPopover, setOpenPopover] = useState(false)
  const { data } = useGetUserInfoAndTeamsInfoByTokenQuery({})
  const currentTeam = data?.teams.find((team) => team.id === data.currentTeamID)

  if (!data?.teams || !currentTeam) return null
  return (
    <Popover
      content={
        <TeamSelectContent
          {...props}
          teams={data.teams}
          currentID={data.currentTeamID!}
          closePopover={() => setOpenPopover(false)}
        />
      }
      trigger={["click"]}
      arrow={false}
      overlayInnerStyle={{
        padding: 0,
      }}
      open={openPopover}
      placement="bottomRight"
      onOpenChange={setOpenPopover}
    >
      <div css={teamSelectContainerStyle}>
        <div css={teamAvatarContainerStyle}>
          <Avatar src={currentTeam.icon} size={24} shape="square" />
        </div>
        <span css={teamNameStyle}>{currentTeam.name}</span>
        <div css={iconContainerStyle}>
          <Icon component={UpAndDownArrowIcon} />
        </div>
      </div>
    </Popover>
  )
}

export default TeamSelect
