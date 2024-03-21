import { Avatar } from "antd"
import { FC } from "react"
import { ICustomTitleProps } from "./interface"
import { iconStyle, titleAndIconContainerStyle, titleStyle } from "./style"

const PCCustomTitle: FC<ICustomTitleProps> = (props) => {
  const { iconURL, title } = props
  return (
    <div css={titleAndIconContainerStyle}>
      <Avatar css={iconStyle} src={iconURL} size={48} />
      <h1 css={titleStyle}>{title}</h1>
    </div>
  )
}

export default PCCustomTitle
