import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const NameEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  return (
    <Controller
      name={`config.variables.${index}.name`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController title="Name">
            <Input size="large" {...field} />
          </LabelWithController>
        )
      }}
    />
  )
}

export default NameEditor
