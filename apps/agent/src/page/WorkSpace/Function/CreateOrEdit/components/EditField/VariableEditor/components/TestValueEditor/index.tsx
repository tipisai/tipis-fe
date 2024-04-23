import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const TestValueEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  return (
    <Controller
      name={`config.variables.${index}.testValue`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController title="testValue">
            <Input
              placeholder="This is a description description description description description description"
              {...field}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default TestValueEditor
