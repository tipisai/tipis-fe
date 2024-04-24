import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const NameEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()
  const { t } = useTranslation()

  return (
    <Controller
      name={`config.variables.${index}.name`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.variable_name")}
          >
            <Input
              size="large"
              {...field}
              placeholder={t(
                "function.edit.variable_modal.placeholder.variable_name",
              )}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default NameEditor
