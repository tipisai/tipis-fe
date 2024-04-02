import Icon from "@ant-design/icons"
import { Button, Divider, Input } from "antd"
import { FC, useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { GithubIcon } from "@illa-public/icon"
import { TipisTrack } from "@illa-public/track-utils"
import { EMAIL_FORMAT, isCloudVersion } from "@illa-public/utils"
import ErrorMessage from "@/components/InputErrorMessage"
import LinkButton from "@/components/LinkButton"
import { FORGOT_PASSWORD_PATH, REGISTER_PATH } from "@/utils/routeHelper"
import { OAuthButton } from "../../components/OAuthButton"
import { CAN_SHOW_OAUTH } from "../../constants"
import { LoginFields } from "../../interface"
import { getValidReportParamsFromLogin } from "../../utils"
import { LoginPageProps } from "../interface"
import {
  containerStyle,
  descriptionStyle,
  forgotPwdContainerStyle,
  formItemStyle,
  formLabelStyle,
  formStyle,
  formTitleStyle,
  itemContainerStyle,
  oAuthButtonGroupStyle,
  oAuthIconStyle,
  oauthContainerStyle,
} from "./style"

const { Password } = Input

export const PCLogin: FC<LoginPageProps> = (props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { onSubmit, errorMsg, lockedEmail, loading } = props

  const { handleSubmit, control, formState, trigger } =
    useFormContext<LoginFields>()

  const { errors } = formState
  const [asyncValid, setAsyncValid] = useState<
    { isValid: boolean } | undefined
  >()

  const validReport = async () => {
    TipisTrack.track("click_email_login_button")
    let isValid = await trigger()
    if (isValid) {
      TipisTrack.track("validate_email_login", {
        parameter2: "suc",
      })
    }
    setAsyncValid({ isValid })
  }

  const handleClickRegister = () => {
    TipisTrack.track("click_create_account_entry")
    navigate({
      pathname: REGISTER_PATH,
      search: location.search,
    })
  }

  const handleClickForgotPassword = () => {
    TipisTrack.track("click_forget_password_entry")
    navigate({
      pathname: FORGOT_PASSWORD_PATH,
      search: location.search,
    })
  }

  useEffect(() => {
    if (asyncValid && !asyncValid.isValid) {
      const parameter3 = getValidReportParamsFromLogin(errors)
      TipisTrack.track("validate_email_login", {
        parameter2: "failed",
        parameter3,
      })
    }
  }, [asyncValid, errors])

  return (
    <div css={containerStyle}>
      <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
        <header css={formItemStyle}>
          <div css={formTitleStyle}>{t("page.user.sign_in.title")}</div>
          <div css={descriptionStyle}>
            <Trans
              i18nKey="page.user.sign_in.description.register"
              t={t}
              components={[
                <LinkButton
                  fontSize={16}
                  key="text-link"
                  onClick={handleClickRegister}
                />,
              ]}
            />
          </div>
        </header>
        <div css={itemContainerStyle}>
          <section css={formItemStyle}>
            <label css={formLabelStyle}>
              {t("page.user.sign_in.fields.email")}
            </label>
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
                  status={
                    !!formState?.errors.email || !!errorMsg.email
                      ? "error"
                      : undefined
                  }
                  variant="filled"
                  placeholder={t("page.user.sign_in.placeholder.email")}
                  {...(lockedEmail && { value: lockedEmail, disabled: true })}
                />
              )}
              rules={{
                required: t("page.user.sign_in.error_message.email.require"),
                validate: (value: string) => {
                  if (isCloudVersion && !EMAIL_FORMAT.test(value)) {
                    return t(
                      "page.user.sign_up.error_message.email.invalid_pattern",
                    )
                  }
                  return value === "root"
                    ? true
                    : EMAIL_FORMAT.test(value)
                      ? true
                      : t(
                          "page.user.sign_up.error_message.email.invalid_pattern",
                        )
                },
              }}
            />
            {(formState?.errors.email || errorMsg.email) && (
              <ErrorMessage
                message={formState?.errors.email?.message || errorMsg.email}
              />
            )}
          </section>
          <section css={formItemStyle}>
            <div css={forgotPwdContainerStyle}>
              <label css={formLabelStyle}>
                {t("page.user.sign_in.fields.password")}
              </label>
              <LinkButton
                style={{
                  marginRight: 8,
                }}
                onClick={handleClickForgotPassword}
              >
                {t("page.user.sign_in.description.forgot_password")}
              </LinkButton>
            </div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Password
                  {...field}
                  size="large"
                  style={{
                    width: "100%",
                  }}
                  tabIndex={2}
                  status={
                    !!formState?.errors.password || !!errorMsg.password
                      ? "error"
                      : undefined
                  }
                  variant="filled"
                  placeholder={t("page.user.password.placeholder")}
                />
              )}
              rules={{
                required: t("page.user.sign_in.error_message.password.require"),
                minLength: {
                  value: 6,
                  message: t(
                    "page.user.sign_in.error_message.password.min_length",
                  ),
                },
              }}
            />
            {(formState?.errors.password || errorMsg.password) && (
              <ErrorMessage
                message={
                  formState?.errors.password?.message || errorMsg.password
                }
              />
            )}
          </section>
        </div>
        <Button
          type="primary"
          size="large"
          loading={loading}
          block
          htmlType="submit"
          onClick={validReport}
        >
          {t("page.user.sign_in.actions.login")}
        </Button>
      </form>
      {CAN_SHOW_OAUTH && (
        <div css={oauthContainerStyle}>
          <Divider>{t("page.user.sign_in.option.or")}</Divider>
          <div css={oAuthButtonGroupStyle}>
            <OAuthButton
              icon={<Icon component={GithubIcon} css={oAuthIconStyle} />}
              type="github"
              isMobile={false}
              landing="signin"
            >
              {t("page.user.sign_in.option.github")}
            </OAuthButton>
          </div>
        </div>
      )}
    </div>
  )
}

PCLogin.displayName = "PCLogin"
