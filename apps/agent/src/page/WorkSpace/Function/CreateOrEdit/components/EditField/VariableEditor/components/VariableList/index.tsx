import { FC } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { IFunctionForm } from "../../../../../interface"
import CreateVariableButton from "../CreateVariableButton"
import VariableListItem from "./item"
import { variableListContainerStyle } from "./style"

const VariableList: FC = () => {
  const { control } = useFormContext<IFunctionForm>()

  const variables = useWatch({
    control,
    name: "parameters",
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
          name="parameters"
          control={control}
          shouldUnregister={false}
          render={({ field }) => (
            <>
              <CreateVariableButton
                buttonProps={{
                  type: "text",
                }}
                addedIndex={field.value.length}
              />
            </>
          )}
        />
      </div>
    </div>
  )
}

export default VariableList
