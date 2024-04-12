import { Avatar } from "antd"
import { FC } from "react"
import { IDetailHeaderProps } from "../interface"
import {
  detailDescStyle,
  detailHeaderContainerStyle,
  detailTitleStyle,
} from "./style"

const MobileDetailHeader: FC<IDetailHeaderProps> = (props) => {
  return (
    <div css={detailHeaderContainerStyle}>
      <Avatar size={64} shape="circle" src={props.avatarURL} />
      <h2 css={detailTitleStyle}>{props.title}</h2>
      <p css={detailDescStyle}>{props.description}</p>
    </div>
  )
}

MobileDetailHeader.displayName = "DetailHeader"
export default MobileDetailHeader
