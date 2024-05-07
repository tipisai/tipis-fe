import { Input, Switch } from "antd"
import { FC } from "react"
import { Controller, useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ILarkBotIntegration } from "@illa-public/public-types"
import LabelWithController from "@/Layout/Function/LabelWithController"
import { WEBHOOK_PREFIX_RULES } from "./rules"
import { switchContext } from "./style"

const TencentCosConfigElement: FC = () => {
  const { control } = useFormContext<ILarkBotIntegration>()
  const { t } = useTranslation()

  const allowImageContent = useWatch({
    control,
    name: "content.allowImageContent",
  })
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
        name="content.allowImageContent"
        control={control}
        render={({ field }) => {
          return (
            <LabelWithController
              title={t("editor.action.form.label.lark.image")}
            >
              <div css={switchContext}>
                <Switch {...field} />
              </div>
            </LabelWithController>
          )
        }}
      />
      {allowImageContent && (
        <Controller
          name="content.bearerToken"
          control={control}
          rules={{
            required: t("editor.action.form.tips.lark.token_null"),
          }}
          shouldUnregister
          render={({ field, fieldState }) => {
            return (
              <LabelWithController
                title={t("editor.action.form.label.lark.token")}
                required
                errorMessage={fieldState.error?.message}
              >
                <Input size="large" {...field} />
              </LabelWithController>
            )
          }}
        />
      )}
    </>
  )
}

export default TencentCosConfigElement
