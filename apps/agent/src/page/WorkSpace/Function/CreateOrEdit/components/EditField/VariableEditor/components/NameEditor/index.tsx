import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"

const NameEditor: FC = () => {
  const { control } = useFormContext<IVariables>()
  const { t } = useTranslation()

  return (
    <Controller
      name="name"
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
