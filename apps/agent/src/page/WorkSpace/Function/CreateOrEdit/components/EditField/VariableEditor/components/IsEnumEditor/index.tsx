import { Switch } from "antd"
import { FC } from "react"
import {
  Controller,
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables, VARIABLE_TYPE } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"

const IsEnumEditor: FC = () => {
  const { control } = useFormContext<IVariables>()

  const { t } = useTranslation()

  const type = useWatch({
    control,
    name: "type",
  })

  const enumValuesController = useController({
    control,
    name: "enum",
  })

  const isBoolean = type === VARIABLE_TYPE.BOOLEAN

  return (
    <Controller
      name="isEnum"
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.enum")}
          >
            <div>
              <Switch
                {...field}
                disabled={isBoolean}
                onChange={(checked) => {
                  if (!checked) {
                    enumValuesController.field.onChange([])
                  }
                  field.onChange(checked)
                }}
              />
            </div>
          </LabelWithController>
        )
      }}
    />
  )
}

export default IsEnumEditor
