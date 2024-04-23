import { FC } from "react"
import { ISecondLabelProps } from "./interface"
import { secondLabelStyle } from "./style"

const SecondLabel: FC<ISecondLabelProps> = (props) => {
  return <p css={secondLabelStyle}>{props.title}</p>
}

export default SecondLabel
