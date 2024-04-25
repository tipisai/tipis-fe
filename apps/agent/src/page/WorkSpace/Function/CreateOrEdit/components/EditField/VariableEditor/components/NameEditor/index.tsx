import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"

const NameEditor: FC = () => {
  const { control } = useFormContext<IVariables>()
  const { t } = useTranslation()

  const { errors } = useFormState({
    control: control,
  })

  return (
    <Controller
      name="name"
      control={control}
      rules={{
        required: t("function.edit.variable_modal.error.variable_name"),
        maxLength: 64,
        pattern: {
          value: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
          message: t("function.edit.configure.name.validate"),
        },
      }}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.variable_name")}
            required
            errorMessage={errors.name?.message}
          >
            <Input
              size="large"
              {...field}
              status={!!errors.name?.message ? "error" : undefined}
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
