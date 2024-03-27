import Icon from "@ant-design/icons"
import { Avatar, Popover } from "antd"
import { FC, useState } from "react"
import UpAndDownArrowIcon from "@/assets/workspace/upAndDownArrow.svg?react"
import { useGetCurrentTeamInfo } from "@/utils/team"
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
  const currentTeam = useGetCurrentTeamInfo()

  return (
    currentTeam && (
      <Popover
        content={
          <TeamSelectContent
            showCreateTeamButton={props.showCreateTeamButton}
            openCreateModal={props.openCreateModal}
            onChangeTeam={props.onChangeTeam}
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
            <Avatar src={currentTeam?.icon} size={24} shape="square" />
          </div>
          <span css={teamNameStyle}>{currentTeam?.name}</span>
          <div css={iconContainerStyle}>
            <Icon component={UpAndDownArrowIcon} />
          </div>
        </div>
      </Popover>
    )
  )
}

export default TeamSelect
