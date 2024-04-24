import { Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { VARIABLE_TYPE } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { IBaseFunctionForm } from "../../../../../interface"
import { IBaseVariableItemEditorProps } from "../../interface"

const TypeEditor: FC<IBaseVariableItemEditorProps> = (props) => {
  const { index } = props
  const { control } = useFormContext<IBaseFunctionForm>()

  const { t } = useTranslation()

  const canUsedVariableType = [
    {
      label: t("function.edit.variable_modal.option.int"),
      value: VARIABLE_TYPE.INT,
    },
    {
      label: t("function.edit.variable_modal.option.float"),
      value: VARIABLE_TYPE.FLOAT,
    },
    {
      label: t("function.edit.variable_modal.option.string"),
      value: VARIABLE_TYPE.STRING,
    },
    {
      label: t("function.edit.variable_modal.option.boolean"),
      value: VARIABLE_TYPE.BOOLEAN,
    },
  ]

  return (
    <Controller
      name={`config.variables.${index}.type`}
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
