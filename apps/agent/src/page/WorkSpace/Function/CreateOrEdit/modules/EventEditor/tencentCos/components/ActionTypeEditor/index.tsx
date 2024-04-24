import { Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  FUNCTION_ACTION_TYPE,
  IBaseFunction,
  TTencentCosFunctionContent,
} from "@illa-public/public-types"
import LabelWithEditor from "../../../labelWithEditor"

const ActionTypeEditor: FC = () => {
  const { control } =
    useFormContext<IBaseFunction<TTencentCosFunctionContent>>()

  const { t } = useTranslation()

  const actionTypeOptions = [
    {
      label: t("editor.action.form.label.tx.action_type.list"),
      value: FUNCTION_ACTION_TYPE.LIST,
    },
    {
      label: t("editor.action.form.option.tx.action_type.download"),
      value: FUNCTION_ACTION_TYPE.GET_DOWNLOAD_URL,
    },
  ]

  return (
    <LabelWithEditor label={t("editor.action.form.label.tx.action_type")}>
      <Controller
        control={control}
        name="content.actionType"
        render={({ field }) => {
          return (
            <Select
              {...field}
              size="large"
              style={{ width: "100%" }}
              options={actionTypeOptions}
            />
          )
        }}
      />
    </LabelWithEditor>
  )
}

export default ActionTypeEditor
