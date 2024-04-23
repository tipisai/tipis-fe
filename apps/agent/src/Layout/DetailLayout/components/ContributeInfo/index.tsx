import { Avatar } from "antd"
import { FC } from "react"
import { getColorByString } from "@illa-public/utils"
import { IContributeInfoProps } from "./interface"
import {
  contributeContainerStyle,
  contributeInfoContainerStyle,
  labelNameStyle,
  teamIconAndNameContainerStyle,
  teamInfoContainerStyle,
  teamNameStyle,
} from "./style"

const ContributeInfo: FC<IContributeInfoProps> = (props) => {
  const {
    contributors,
    teamAvatar,
    teamName,
    contributeLabelName = "Contributor",
  } = props
  return (
    <div css={contributeContainerStyle}>
      <div css={teamInfoContainerStyle}>
        <p css={labelNameStyle}>Team</p>
        <div css={teamIconAndNameContainerStyle}>
          <Avatar size={32} shape="circle" src={teamAvatar} />
          <p css={teamNameStyle}>{teamName}</p>
        </div>
      </div>
      <div css={teamInfoContainerStyle}>
        <p css={labelNameStyle}>{contributeLabelName}</p>
        <div css={contributeInfoContainerStyle}>
          <Avatar.Group>
            {contributors.map(({ avatar, userID, nickname }) => (
              <Avatar
                src={avatar}
                shape="circle"
                size={32}
                key={avatar}
                style={{
                  background: avatar
                    ? "#ffffff"
                    : getColorByString(userID || ""),
                }}
              >
                {nickname[0] ? nickname[0].toLocaleUpperCase() : "U"}
              </Avatar>
            ))}
          </Avatar.Group>
        </div>
      </div>
    </div>
  )
}

ContributeInfo.displayName = "ContributeInfo"

export default ContributeInfo
