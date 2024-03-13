import { FC } from "react"
import { ICustomTitleProps } from "./interface"
import { iconStyle, titleAndIconContainerStyle, titleStyle } from "./style"

const CustomTitle: FC<ICustomTitleProps> = (props) => {
  const { iconURL, title } = props
  return (
    <div css={titleAndIconContainerStyle}>
      <img css={iconStyle} src={iconURL} />
      <h1 css={titleStyle}>{title}</h1>
    </div>
  )
}

export default CustomTitle
