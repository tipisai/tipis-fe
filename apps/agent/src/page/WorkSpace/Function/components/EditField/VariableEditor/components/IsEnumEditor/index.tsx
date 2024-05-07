import { Switch } from "antd"
import { FC } from "react"
import {
  Controller,
  useController,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { CANT_ENUM_TYPE } from "../config"
import { containerStyle } from "./style"

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

  const isDisabled = CANT_ENUM_TYPE.includes(type)

  return (
    <Controller
      name="isEnum"
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.enum")}
          >
            <div css={containerStyle}>
              <Switch
                {...field}
                disabled={isDisabled}
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
