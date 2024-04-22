import { FC } from "react"
import SecondLabel from "./SecondLabel"
import { IFirstLabelProps } from "./interface"
import { firstLabelContainerStyle, firstLabelStyle } from "./style"

const FirstLabel: FC<IFirstLabelProps> = (props) => {
  const { title, subTitle } = props
  return (
    <div css={firstLabelContainerStyle}>
      <p css={firstLabelStyle}>{title}</p>
      {subTitle && <SecondLabel title={subTitle} />}
    </div>
  )
}

export default FirstLabel
