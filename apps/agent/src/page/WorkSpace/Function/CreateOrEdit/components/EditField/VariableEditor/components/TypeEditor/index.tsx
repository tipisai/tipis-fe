import { Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const TypeEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  return (
    <Controller
      name={`config.variables.${index}.type`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController title="Type">
            <Select
              style={{
                width: "100%",
              }}
              {...field}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default TypeEditor
