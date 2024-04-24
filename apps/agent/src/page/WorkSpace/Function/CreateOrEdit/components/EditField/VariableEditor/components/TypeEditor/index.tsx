import { Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { IVariables, VARIABLE_TYPE } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"

const TypeEditor: FC = () => {
  const { control } = useFormContext<IVariables>()

  const { t } = useTranslation()

  const canUsedVariableType = [
    {
      label: "Int",
      value: VARIABLE_TYPE.INT,
    },
    {
      label: "Float",
      value: VARIABLE_TYPE.FLOAT,
    },
    {
      label: "String",
      value: VARIABLE_TYPE.STRING,
    },
    {
      label: "Boolean",
      value: VARIABLE_TYPE.BOOLEAN,
    },
  ]

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
              options={canUsedVariableType}
              {...field}
            />
          </LabelWithController>
        )
      }}
    />
  )
}

export default TypeEditor
