import { FC } from "react"
import SaveButton from "../../../components/SaveButton"
import StartButton from "../../../components/StartButton"
import { IActionGroupProps } from "./interface"
import { actionGroupContainerStyle } from "./style"

const ActionGroup: FC<IActionGroupProps> = (props) => {
  return (
    <div css={actionGroupContainerStyle}>
      <StartButton onClickCallback={props.onClickStartCallback} />
      <SaveButton />
    </div>
  )
}

export default ActionGroup
