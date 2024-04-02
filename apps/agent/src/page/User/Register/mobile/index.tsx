import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC, useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { GithubIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { EmailCode } from "@/components/EmailCode"
import ErrorMessage from "@/components/InputErrorMessage"
import LinkButton from "@/components/LinkButton"
import { LOGIN_PATH } from "@/utils/routeHelper"
import { OAuthButton } from "../../components/OAuthButton"
import { CAN_SHOW_OAUTH, EMAIL_FORMAT } from "../../constants"
import { RegisterFields } from "../../interface"
import { getValidReportParamsFromRegister } from "../../utils"
import { RegisterProps } from "../interface"
import {
  containerStyle,
  descriptionStyle,
  formItemContainerStyle,
  formStyle,
  formTitleStyle,
  headerStyle,
  oAuthButtonGroupStyle,
  oAuthIconStyle,
} from "./style"

const { Password } = Input

export const MobileRegister: FC<RegisterProps> = (props) => {
  const {
    lockedEmail,
    onSubmit,
    errorMsg,
    loading,
    showCountDown,
    onCountDownChange,
    sendEmail,
  } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { handleSubmit, control, formState, trigger } =
    useFormContext<RegisterFields>()

  const { errors } = formState
  const [asyncValid, setAsyncValid] = useState<
    { isValid: boolean } | undefined
  >()

  const validReport = async () => {
    TipisTrack.track("click_create_account")
    let isValid = await trigger()
    if (isValid) {
      TipisTrack.track("validate_create_account", {
        parameter2: "suc",
      })
    }
    setAsyncValid({ isValid })
  }

  useEffect(() => {
    if (asyncValid && !asyncValid.isValid) {
      const parameter3 = getValidReportParamsFromRegister(errors)
      TipisTrack.track("validate_create_account", {
        parameter2: "failed",
        parameter3,
      })
    }
  }, [asyncValid, errors])

  const handleClickToLogin = () => {
    TipisTrack.track("click_sign_in_entry")
    navigate({ pathname: LOGIN_PATH, search: location.search })
  }

  return (
    <div css={containerStyle}>
      <form
        css={formStyle}
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header css={headerStyle}>
          <div css={formTitleStyle}>{t("page.user.sign_up.title")}</div>
          <div css={descriptionStyle}>
            <Trans
              i18nKey="page.user.sign_up.description.login"
              t={t}
              components={[
                <LinkButton
                  style={{
                    marginRight: 8,
                  }}
                  fontSize={14}
                  key="go-to-login"
                  onClick={handleClickToLogin}
                />,
              ]}
            />
          </div>
        </header>

        <section css={formItemContainerStyle}>
          <Controller
            name="nickname"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                style={{
                  width: "100%",
                }}
                size="large"
                status={!!formState?.errors.nickname ? "error" : undefined}
                variant="filled"
                placeholder={t("page.user.sign_up.fields.username")}
              />
            )}
            rules={{
              required: t("page.user.sign_up.error_message.username.require"),
              maxLength: {
                value: 15,
                message: t("page.user.sign_up.error_message.username.length"),
              },
              minLength: {
                value: 3,
                message: t("page.user.sign_up.error_message.username.length"),
              },
            }}
          />
          {formState?.errors.nickname && (
            <ErrorMessage message={formState?.errors.nickname.message} />
          )}
        </section>

        <section css={formItemContainerStyle}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                style={{
                  width: "100%",
                }}
                size="large"
                type="email"
                status={
                  !!formState?.errors.email || !!errorMsg.email
                    ? "error"
                    : undefined
                }
                variant="filled"
                placeholder={t("page.user.sign_up.fields.email")}
                {...(lockedEmail && { value: lockedEmail, disabled: true })}
              />
            )}
            rules={{
              required: t("page.user.sign_up.error_message.email.require"),
              pattern: {
                value: EMAIL_FORMAT,
                message: t(
                  "page.user.sign_up.error_message.email.invalid_pattern",
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
                style={{
                  width: "100%",
                }}
                size="large"
                type="number"
                status={
                  !!formState?.errors.verificationCode ||
                  !!errorMsg.verificationCode
                    ? "error"
                    : undefined
                }
                variant="filled"
                suffix={
                  <EmailCode
                    usage="signup"
                    showCountDown={showCountDown}
                    onCountDownChange={onCountDownChange}
                    sendEmail={sendEmail}
                  />
                }
                placeholder={t("page.user.sign_up.fields.verification_code")}
              />
            )}
            rules={{
              required: t(
                "page.user.sign_up.error_message.verification_code.require",
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
        </section>

        <section css={formItemContainerStyle}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                style={{
                  width: "100%",
                }}
                size="large"
                status={!!formState?.errors.password ? "error" : undefined}
                variant="filled"
                placeholder={t("page.user.sign_up.fields.password")}
              />
            )}
            rules={{
              required: t("page.user.sign_up.error_message.password.require"),
              minLength: {
                value: 6,
                message: t(
                  "page.user.sign_in.error_message.password.min_length",
                ),
              },
              validate: (value) => {
                return value.includes(" ")
                  ? t("setting.password.error_password_has_empty")
                  : true
              },
            }}
          />
          {formState?.errors.password && (
            <ErrorMessage message={formState?.errors.password.message} />
          )}
        </section>
        <Button
          size="large"
          type="primary"
          loading={loading}
          htmlType="submit"
          block
          onClick={validReport}
        >
          {t("page.user.sign_up.actions.create")}
        </Button>
      </form>
      {CAN_SHOW_OAUTH && (
        <div css={oAuthButtonGroupStyle}>
          <OAuthButton
            icon={<Icon component={GithubIcon} css={oAuthIconStyle} />}
            type="github"
            isMobile
            landing="signup"
          />
        </div>
      )}
    </div>
  )
}

MobileRegister.displayName = "MobileRegister"
