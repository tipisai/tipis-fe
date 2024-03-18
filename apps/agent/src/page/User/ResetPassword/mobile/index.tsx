import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC, useContext, useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { PreviousIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_MIXPANEL_PUBLIC_PAGE_NAME,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { EmailCode } from "@/components/EmailCode"
import ErrorMessage from "@/components/InputErrorMessage"
import { LOGIN_PATH } from "@/utils/routeHelper"
import { EMAIL_FORMAT } from "../../constants"
import { ResetPwdFields } from "../../interface"
import { getValidReportParams } from "../../utils"
import { ResetProps } from "../interface"
import {
  formItemContainerStyle,
  formStyle,
  formTitleStyle,
  headerStyle,
  hotspotWrapperStyle,
  prevIconStyle,
  resetPasswordSubtitleWrapperStyle,
} from "./style"

const { Password } = Input

export const MobileReset: FC<ResetProps> = (props) => {
  const {
    onSubmit,
    errorMsg,
    loading,
    lockedEmail,
    resetLabel,
    showCountDown,
    onCountDownChange,
    sendEmail,
  } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { track } = useContext(MixpanelTrackContext)
  const { handleSubmit, control, formState, getValues, trigger } =
    useFormContext<ResetPwdFields>()
  const backToLogin = () => {
    navigate({ pathname: LOGIN_PATH, search: location.search })
  }
  const { errors } = formState
  const [asyncValid, setAsyncValid] = useState<
    { isValid: boolean } | undefined
  >()

  const validReport = async () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "reset_password",
    })
    let isValid = await trigger()
    if (isValid) {
      const params = getValidReportParams(
        ILLA_MIXPANEL_PUBLIC_PAGE_NAME.FORGET_PASSWORD,
        true,
        {},
      )

      params &&
        track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
          ...params,
          element: "reset_password",
        })
    }
    setAsyncValid({ isValid })
  }

  useEffect(() => {
    if (asyncValid && !asyncValid.isValid) {
      const params = getValidReportParams(
        ILLA_MIXPANEL_PUBLIC_PAGE_NAME.FORGET_PASSWORD,
        false,
        errors,
      )
      params &&
        track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
          ...params,
          element: "reset_password",
        })
    }
  }, [errors, asyncValid, track])

  return (
    <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
      <header css={headerStyle}>
        <span css={formTitleStyle}>{t("page.user.forgot_password.title")}</span>
        <div css={resetPasswordSubtitleWrapperStyle} onClick={backToLogin}>
          <span css={hotspotWrapperStyle}>
            <Icon component={PreviousIcon} css={prevIconStyle} />
            {t("page.user.forgot_password.subtitle")}
          </span>
        </div>
      </header>

      <section css={formItemContainerStyle}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              size="large"
              status={
                !!formState?.errors.email || !!errorMsg.email
                  ? "error"
                  : undefined
              }
              variant="filled"
              placeholder={t("page.user.forgot_password.fields.email")}
              {...(lockedEmail && { value: lockedEmail, disabled: true })}
              onFocus={() => {
                track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                  element: "username_input",
                  parameter3: getValues().email?.length ?? 0,
                })
              }}
              onBlur={() => {
                track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                  element: "username_input",
                  parameter3: getValues().email?.length ?? 0,
                })
              }}
            />
          )}
          rules={{
            required: t(
              "page.user.forgot_password.error_message.email.require",
            ),
            pattern: {
              value: EMAIL_FORMAT,
              message: t(
                "page.user.forgot_password.error_message.email.invalid_pattern",
              ),
            },
          }}
        />
        {(formState?.errors.email || errorMsg.email) && (
          <ErrorMessage
            message={formState?.errors.email?.message || errorMsg.email}
          />
        )}
      </section>
      <section css={formItemContainerStyle}>
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
              onFocus={() => {
                track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                  element: "verification_code_input",
                  parameter3: getValues().verificationCode?.length ?? 0,
                })
              }}
              onBlur={() => {
                track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                  element: "verification_code_input",
                  parameter3: getValues().verificationCode?.length ?? 0,
                })
              }}
              placeholder={t(
                "page.user.forgot_password.fields.verification_code",
              )}
            />
          )}
          rules={{
            required: t(
              "page.user.forgot_password.error_message.verification_code.require",
            ),
          }}
        />
        {(formState?.errors.verificationCode || errorMsg.verificationCode) && (
          <ErrorMessage
            message={
              formState?.errors.verificationCode?.message ||
              errorMsg.verificationCode
            }
          />
        )}
      </section>
      <section css={formItemContainerStyle}>
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Password
              {...field}
              size="large"
              status={!!formState?.errors.newPassword ? "error" : undefined}
              variant="filled"
              placeholder={t("page.user.forgot_password.fields.newPassword")}
              onFocus={() => {
                track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                  element: "password_input",
                  parameter3: getValues().newPassword?.length ?? 0,
                })
              }}
              onBlur={() => {
                track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                  element: "password_input",
                  parameter3: getValues().newPassword?.length ?? 0,
                })
              }}
            />
          )}
          rules={{
            required: t(
              "page.user.forgot_password.error_message.newPassword.require",
            ),
            minLength: {
              value: 6,
              message: t("page.user.sign_in.error_message.password.min_length"),
            },
          }}
        />
        {formState?.errors.newPassword && (
          <ErrorMessage message={formState?.errors.newPassword.message} />
        )}
      </section>

      <Button
        type="primary"
        size="large"
        loading={loading}
        block
        onClick={validReport}
      >
        {resetLabel ? resetLabel : t("page.user.forgot_password.actions.reset")}
      </Button>
    </form>
  )
}

MobileReset.displayName = "MobileReset"
