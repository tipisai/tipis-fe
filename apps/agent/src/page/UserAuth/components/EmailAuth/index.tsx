import { App, Button, Input } from "antd"
import { FC, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useAuthByMagicLinkMutation } from "@illa-public/user-data"
import { EMAIL_FORMAT } from "@illa-public/utils"
import ErrorMessage from "@/components/InputErrorMessage"
import i18n from "@/i18n"
import { AUTH_STEP, IEmailForm } from "../../AuthPage/interface"
import { IEmailAuthProps } from "./interface"
import { formContainerStyle, inputContainerStyle } from "./style"

const EmailAuth: FC<IEmailAuthProps> = ({ setAuthStep }) => {
  const { handleSubmit, control, formState, trigger, getValues } =
    useFormContext<IEmailForm>()
  const { t } = useTranslation()
  const { message } = App.useApp()
  const [sendLoading, setSendLoading] = useState(false)
  const [authByMagicLink] = useAuthByMagicLinkMutation()
  const submitEmailAuth = async () => {
    if (sendLoading) return
    setSendLoading(true)
    await trigger()
    const { email } = getValues()
    try {
      const name = email.split("@")[0]
      await authByMagicLink({
        email,
        name,
        language: i18n.language,
      }).unwrap()
      setAuthStep(AUTH_STEP.RESEND_PAGE)
    } catch (e) {
      message.error(t("page.user.new_auth.email_sent_failed"))
    } finally {
      setSendLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit(submitEmailAuth)} css={formContainerStyle}>
      <section css={inputContainerStyle}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              style={{
                width: "100%",
              }}
              tabIndex={1}
              size="large"
              status={!!formState?.errors.email ? "error" : undefined}
              placeholder={t("page.user.new_auth.email.placeholder")}
            />
          )}
          rules={{
            required: t("page.user.new_auth.email.verify_empty"),
            validate: (value: string) => {
              if (!EMAIL_FORMAT.test(value)) {
                return t("page.user.new_auth.email.verify_format_error")
              }
            },
          }}
        />
        {formState?.errors.email && (
          <ErrorMessage message={formState?.errors.email?.message} />
        )}
      </section>
      <Button
        type="primary"
        block
        size="large"
        htmlType="submit"
        loading={sendLoading}
      >
        {t("page.user.new_auth.email.button")}
      </Button>
    </form>
  )
}

export default EmailAuth
