import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { IAgentForm } from "../../../AIAgent/interface"
import { IInputAreaProps } from "./interface"
import { inputAreaContainerStyle, variableNameContainerStyle } from "./style"

const InputVariableArea: FC<IInputAreaProps> = (props) => {
  const { variableName, index } = props
  const { control } = useFormContext<IAgentForm>()
  return (
    <div css={inputAreaContainerStyle}>
      <p css={variableNameContainerStyle}>{variableName}</p>
      <Controller
        name={`variables.${index}.value`}
        control={control}
        shouldUnregister={false}
        render={({ field }) => <Input {...field} size="large" />}
      />
    </div>
  )
}

export default InputVariableArea
