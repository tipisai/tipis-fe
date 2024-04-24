import { FC } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { IBaseFunctionForm } from "@/page/WorkSpace/Function/CreateOrEdit/interface"
import CreateVariableButton from "../CreateVariableButton"
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
      <div>
        <Controller
          name="config.variables"
          control={control}
          shouldUnregister={false}
          render={({ field }) => (
            <>
              <CreateVariableButton
                buttonProps={{
                  type: "text",
                }}
                addedIndex={field.value.length - 1}
              />
            </>
          )}
        />
      </div>
    </div>
  )
}

export default VariableList
