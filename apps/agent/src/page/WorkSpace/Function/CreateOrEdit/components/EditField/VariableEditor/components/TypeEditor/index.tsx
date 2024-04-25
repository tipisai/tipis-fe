import { Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { VARIABLE_TYPE_OPTIONS } from "../config"

const TypeEditor: FC = () => {
  const { control } = useFormContext<IVariables>()

  const { t } = useTranslation()

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
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default TypeEditor
