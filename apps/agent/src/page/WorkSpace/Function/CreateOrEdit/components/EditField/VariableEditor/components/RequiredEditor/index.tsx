import { Switch } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const RequiredEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  const { t } = useTranslation()

  return (
    <Controller
      name={`config.variables.${index}.required`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.required")}
          >
            <Switch {...field} />
          </LabelWithController>
        )
      }}
    />
  )
}

export default RequiredEditor
