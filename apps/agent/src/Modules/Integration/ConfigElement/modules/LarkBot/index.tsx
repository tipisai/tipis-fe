import { Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ILarkBotIntegration } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { WEBHOOK_PREFIX_RULES } from "./rules"

const TencentCosConfigElement: FC = () => {
  const { control } = useFormContext<ILarkBotIntegration>()
  const { t } = useTranslation()

  return (
    <>
      <Controller
        name="content.webhookAddress"
        control={control}
        rules={{
          required: t("editor.action.form.tips.lark.webhook_null"),
          validate: (value) => {
            if (WEBHOOK_PREFIX_RULES.every((rule) => !value.startsWith(rule))) {
              return t("editor.action.form.tips.lark.webhook")
            }
            return true
          },
        }}
        render={({ field, fieldState }) => {
          return (
            <LabelWithController
              title={t("editor.action.form.label.lark.webhook")}
              required
              errorMessage={fieldState.error?.message}
            >
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />

      <Controller
        name="content.bearerToken"
        control={control}
        shouldUnregister
        render={({ field }) => {
          return (
            <LabelWithController
              title={t("editor.action.form.label.lark.token")}
            >
              <Input size="large" {...field} />
            </LabelWithController>
          )
        }}
      />
    </>
  )
}

export default TencentCosConfigElement
