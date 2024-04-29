import { Select } from "antd"
import { FC } from "react"
import { Controller, useController, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { CANT_ENUM_TYPE, VARIABLE_TYPE_OPTIONS } from "../config"

const TypeEditor: FC = () => {
  const { control } = useFormContext<IVariables>()

  const { t } = useTranslation()

  const enumValuesController = useController({
    control,
    name: "enum",
  })
  const isEnumController = useController({
    control,
    name: "isEnum",
  })

  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.type")}
          >
            <Select
              style={{
                width: "100%",
              }}
              size="large"
              options={VARIABLE_TYPE_OPTIONS}
              {...field}
              onChange={(value) => {
                if (CANT_ENUM_TYPE.includes(value)) {
                  enumValuesController.field.onChange([])
                  isEnumController.field.onChange(false)
                }
                field.onChange(value)
              }}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default TypeEditor
