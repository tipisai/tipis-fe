import { Button, Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { EmailCode } from "@/components/EmailCode"
import ErrorMessage from "@/components/InputErrorMessage"
import { FirstSetPasswordProps, IFirstSetPasswordFields } from "../interface"
import { controllerContainerStyle, formContainerStyle } from "./style"

const { Password } = Input

const SetPasswordMobile: FC<FirstSetPasswordProps> = (props) => {
  const { onSubmit, errorMsg, showCountDown, onCountDownChange, sendEmail } =
    props
  const { t } = useTranslation()
  const { handleSubmit, control, formState } =
    useFormContext<IFirstSetPasswordFields>()

  return (
    <form onSubmit={handleSubmit(onSubmit)} css={formContainerStyle}>
      <section css={controllerContainerStyle}>
        <label>{t("page.user.forgot_password.fields.verification_code")}</label>
        <div>
          <Controller
            name="verificationCode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                maxLength={6}
                size="large"
                status={
                  !!formState?.errors.verificationCode ||
                  !!errorMsg.verificationCode
                    ? "error"
                    : undefined
                }
                variant="filled"
                suffix={
                  <EmailCode
                    usage="forgetpwd"
                    showCountDown={showCountDown}
                    onCountDownChange={onCountDownChange}
                    sendEmail={sendEmail}
                  />
                }
                placeholder={t(
                  "page.user.forgot_password.error_message.verification_code.require",
                )}
              />
            )}
            rules={{
              required: t(
                "page.user.forgot_password.error_message.verification_code.require",
              ),
            }}
          />
          {formState?.errors.verificationCode && (
            <ErrorMessage
              message={formState?.errors.verificationCode?.message}
            />
          )}
        </div>
      </section>
      <section css={controllerContainerStyle}>
        <label> {t("page.user.sign_up.fields.password")}</label>
        <div>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                size="large"
                status={!!formState?.errors.newPassword ? "error" : undefined}
                variant="filled"
                placeholder={t("page.user.password.placeholder")}
              />
            )}
            rules={{
              required: t(
                "page.user.forgot_password.error_message.newPassword.require",
              ),
              minLength: {
                value: 6,
                message: t(
                  "page.user.sign_in.error_message.password.min_length",
                ),
              },
            }}
          />
          {formState?.errors.newPassword && (
            <ErrorMessage message={formState?.errors.newPassword.message} />
          )}
        </div>
      </section>
      <Button size="large" type="primary" disabled={false} block>
        {t("profile.setting.save")}
      </Button>
    </form>
  )
}

export default SetPasswordMobile
