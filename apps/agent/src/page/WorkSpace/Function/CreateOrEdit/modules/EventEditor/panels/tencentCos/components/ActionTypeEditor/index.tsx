import { Select } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  // FUNCTION_ACTION_TYPE,
  ITencentCosFunction,
  TENCENT_COS_ACTION_OPERATION,
} from "@illa-public/public-types"
import LabelWithEditor from "../../../../components/labelWithEditor"

const ActionTypeEditor: FC = () => {
  const { control } = useFormContext<ITencentCosFunction>()

  const { t } = useTranslation()

  const actionTypeOptions = [
    {
      label: t("editor.action.form.label.tx.action_type.list"),
      value: TENCENT_COS_ACTION_OPERATION.TENCENT_COS_LIST,
    },
    {
      label: t("editor.action.form.option.tx.action_type.download"),
      value: TENCENT_COS_ACTION_OPERATION.TENCENT_COS_DOWNLOAD,
    },
  ]

  return (
    <LabelWithEditor label={t("editor.action.form.label.tx.action_type")}>
      <Controller
        control={control}
        name="actionOperation"
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
