import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"

const DescriptionEditor: FC = () => {
  const { control } = useFormContext<IVariables>()
  const { t } = useTranslation()

  return (
    <Controller
      name="description"
      control={control}
      rules={{
        required: t("function.edit.variable_modal.error.description"),
        maxLength: 1024,
      }}
      render={({ field, fieldState }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.description")}
            errorMessage={fieldState.error?.message}
            required
          >
            <Input.TextArea
              maxLength={1024}
              placeholder={t(
                "function.edit.variable_modal.placeholder.description",
              )}
              rows={5}
              autoSize={{ minRows: 5, maxRows: 5 }}
              status={!!fieldState.error?.message ? "error" : undefined}
              {...field}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default DescriptionEditor
