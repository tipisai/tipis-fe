import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const DescriptionEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  return (
    <Controller
      name={`config.variables.${index}.description`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController title="description">
            <Input.TextArea
              maxLength={160}
              placeholder="This is a description description description description description description"
              autoSize={{
                minRows: 1,
                maxRows: 5,
              }}
              {...field}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default DescriptionEditor
