import { FC } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { IBaseFunctionForm } from "../../../../../interface"
import VariableListItem from "./item"
import { variableListContainerStyle } from "./style"

const VariableList: FC = () => {
  const { control } = useFormContext<IBaseFunctionForm>()

  const variables = useWatch({
    control,
    name: "config.variables",
  })
  return (
    <div css={variableListContainerStyle}>
      {variables.map((variable, index) => (
        <VariableListItem
          key={index}
          index={index}
          variableName={variable.name}
        />
      ))}
    </div>
  )
}

export default VariableList
