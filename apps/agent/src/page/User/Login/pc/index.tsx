import Icon from "@ant-design/icons"
import { Button, Divider, Input } from "antd"
import { FC, useContext, useEffect, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { GithubIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_MIXPANEL_PUBLIC_PAGE_NAME,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { EMAIL_FORMAT, isCloudVersion } from "@illa-public/utils"
import ErrorMessage from "../../components/ErrorMessage"
import LinkButton from "../../components/LinkButton"
import { OAuthButton } from "../../components/OAuthButton"
import { LoginFields } from "../../interface"
import { getValidReportParams } from "../../utils/getValidReportParams"
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
  const { track } = useContext(MixpanelTrackContext)

  const { handleSubmit, control, formState, getValues, trigger } =
    useFormContext<LoginFields>()
  const { errors } = formState
  const [asyncValid, setAsyncValid] = useState<
    { isValid: boolean } | undefined
  >()

  const validReport = async () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "sign_in",
    })

    let isValid = await trigger()
    if (isValid) {
      const params = getValidReportParams(
        ILLA_MIXPANEL_PUBLIC_PAGE_NAME.LOGIN,
        true,
        {},
      )
      params &&
        track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
          ...params,
          element: "sign_in",
        })
    }
    setAsyncValid({ isValid })
  }

  const handleClickRegister = () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "create_account",
    })
    navigate({
      pathname: "/user/register",
      search: location.search,
    })
  }

  const handleClickForgotPassword = () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "forget_password",
    })
    navigate({
      pathname: "/user/forgotPassword",
      search: location.search,
    })
  }

  useEffect(() => {
    if (asyncValid && !asyncValid.isValid) {
      const params = getValidReportParams(
        ILLA_MIXPANEL_PUBLIC_PAGE_NAME.LOGIN,
        true,
        errors,
      )
      params &&
        track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
          ...params,
          element: "sign_in",
        })
    }
  }, [asyncValid, errors, track])

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
                  size="large"
                  status={
                    !!formState?.errors.email || !!errorMsg.email
                      ? "error"
                      : undefined
                  }
                  variant="filled"
                  placeholder={t("page.user.sign_in.placeholder.email")}
                  {...(lockedEmail && { value: lockedEmail, disabled: true })}
                  onFocus={() => {
                    track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                      element: "email_input",
                      parameter3: getValues().email?.length ?? 0,
                    })
                  }}
                  onBlur={() => {
                    track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                      element: "email_input",
                      parameter3: getValues().email?.length ?? 0,
                    })
                  }}
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
                  status={
                    !!formState?.errors.password || !!errorMsg.password
                      ? "error"
                      : undefined
                  }
                  variant="filled"
                  placeholder={t("page.user.password.placeholder")}
                  onFocus={() => {
                    track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                      element: "password_input",
                      parameter3: getValues().password?.length ?? 0,
                    })
                  }}
                  onBlur={() => {
                    track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                      element: "password_input",
                      parameter3: getValues().password?.length ?? 0,
                    })
                  }}
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
    </div>
  )
}

PCLogin.displayName = "PCLogin"
