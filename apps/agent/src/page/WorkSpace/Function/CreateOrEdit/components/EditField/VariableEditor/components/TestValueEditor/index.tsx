import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"

const TestValueEditor: FC = () => {
  const { control } = useFormContext<IVariables>()

  const { t } = useTranslation()

  return (
    <Controller
      name="testValue"
      control={control}
      render={({ field }) => {
        return (
          <LabelWithController
            title={t("function.edit.variable_modal.label.test_value")}
          >
            <Input {...field} size="large" />
          </LabelWithController>
        )
      }}
    />
  )
}

export default TestValueEditor
