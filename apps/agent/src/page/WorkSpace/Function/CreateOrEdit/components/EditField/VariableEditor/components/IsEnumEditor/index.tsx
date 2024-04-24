import { Switch } from "antd"
import { FC } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { VARIABLE_TYPE } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const IsEnumEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  const { t } = useTranslation()

  const [type] = useWatch({
    control,
    name: [`config.variables.${index}.type`],
  })

  const isBoolean = type === VARIABLE_TYPE.BOOLEAN

  return (
    <Controller
      name={`config.variables.${index}.isEnum`}
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.enum")}
          >
            <Switch {...field} disabled={isBoolean} />
          </LabelWithController>
        )
      }}
    />
  )
}

export default IsEnumEditor
