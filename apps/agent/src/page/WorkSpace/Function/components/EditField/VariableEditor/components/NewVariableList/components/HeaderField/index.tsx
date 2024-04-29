import { FC } from "react"
import { IHeaderFieldProps } from "./interface"
import { headerFieldContainerStyle, headerTextStyle } from "./style"

const HeaderField: FC<IHeaderFieldProps> = (props) => {
  const { title } = props
  return (
    <div css={headerFieldContainerStyle}>
      <p css={headerTextStyle}>{title}</p>
    </div>
  )
}

export default HeaderField
