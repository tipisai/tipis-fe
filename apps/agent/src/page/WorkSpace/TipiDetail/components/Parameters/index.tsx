import { FC } from "react"
import { RecordEditor } from "@illa-public/record-editor"
import { IParameterProps } from "./interface"
import { ParametersContainerStyle, labelStyle } from "./style"

const Parameters: FC<IParameterProps> = (props) => {
  return (
    <div css={ParametersContainerStyle}>
      <p css={labelStyle}>Knowledge</p>
      <RecordEditor records={props.parameters} label="" />
    </div>
  )
}

Parameters.displayName = "Knowledge"
export default Parameters
