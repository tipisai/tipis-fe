import { Button, Input } from "antd"
import { FC, useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { EmailCode } from "@/components/EmailCode"
import ErrorMessage from "@/components/InputErrorMessage"
import { Header } from "@/page/SettingPage/components/Header"
import { FirstSetPasswordProps, IFirstSetPasswordFields } from "../interface"
import {
  formContainerStyle,
  formLabelStyle,
  gridFormFieldStyle,
  gridItemStyle,
  innerContainerStyle,
} from "./style"

const { Password } = Input

const SetPasswordPC: FC<FirstSetPasswordProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, errorMsg, showCountDown, onCountDownChange } = props
  const { handleSubmit, control, formState, watch } =
    useFormContext<IFirstSetPasswordFields>()
  const { newPassword, verificationCode } = watch()

  const disabled = useMemo(() => {
    return !(newPassword && verificationCode)
  }, [newPassword, verificationCode])

  return (
    <>
      <Header title={t("profile.setting.password.title")} />
      <div css={innerContainerStyle}>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          css={formContainerStyle}
        >
          <section css={gridFormFieldStyle}>
            <section css={gridItemStyle}>
              <label css={formLabelStyle}>
                {t("page.user.forgot_password.fields.verification_code")}
              </label>
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
                      autoComplete="off"
                      suffix={
                        <EmailCode
                          usage="forgetpwd"
                          showCountDown={showCountDown}
                          onCountDownChange={onCountDownChange}
                        />
                      }
                      placeholder={t(
                        "page.user.forgot_password.placeholder.verification_code",
                      )}
                    />
                  )}
                  rules={{
                    required: t(
                      "page.user.forgot_password.error_message.verification_code.require",
                    ),
                  }}
                />
                {(formState?.errors.verificationCode ||
                  errorMsg.verificationCode) && (
                  <ErrorMessage
                    message={
                      formState?.errors.verificationCode?.message ||
                      errorMsg.verificationCode
                    }
                  />
                )}
              </div>
            </section>
            <section css={gridItemStyle}>
              <label css={formLabelStyle}>
                {t("page.user.sign_up.fields.password")}
              </label>
              <div>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <Password
                      {...field}
                      autoComplete="new-password"
                      size="large"
                      status={
                        !!formState?.errors.newPassword ? "error" : undefined
                      }
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
                  <ErrorMessage
                    message={formState?.errors.newPassword.message}
                  />
                )}
              </div>
            </section>
          </section>
          <span>
            <Button
              type="primary"
              size="large"
              disabled={disabled}
              htmlType="submit"
            >
              {t("profile.setting.save")}
            </Button>
          </span>
        </form>
      </div>
    </>
  )
}

export default SetPasswordPC
