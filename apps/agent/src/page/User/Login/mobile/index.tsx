import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
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
import ErrorMessage from "../../components/ErrorMessage"
import LinkButton from "../../components/LinkButton"
import { OAuthButton } from "../../components/OAuthButton"
import { EMAIL_FORMAT } from "../../constants"
import { LoginFields } from "../../interface"
import { getValidReportParams } from "../../utils/getValidReportParams"
import { LoginPageProps } from "../interface"
import {
  containerStyle,
  descriptionStyle,
  forgotPwdStyle,
  formItemContainerStyle,
  formStyle,
  formTitleStyle,
  headerStyle,
  oAuthButtonGroupStyle,
  oAuthIconStyle,
} from "./style"

const { Password } = Input

export const MobileLogin: FC<LoginPageProps> = (props) => {
  const { onSubmit, errorMsg, lockedEmail, loading } = props
  const navigate = useNavigate()
  const { t } = useTranslation()
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
    navigate({ pathname: "/user/register", search: location.search })
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
        false,
        errors,
      )
      params &&
        track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
          ...params,
          element: "sign_in",
        })
    }
  }, [errors, asyncValid, track])

  return (
    <div css={containerStyle}>
      <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
        <header css={headerStyle}>
          <div css={formTitleStyle}>{t("page.user.sign_in.title")}</div>
          <div css={descriptionStyle}>
            <Trans
              i18nKey="page.user.sign_in.description.register"
              t={t}
              components={[
                <LinkButton
                  style={{
                    marginRight: 8,
                  }}
                  fontSize={14}
                  key="text-link"
                  onClick={handleClickRegister}
                />,
              ]}
            />
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
                style={{
                  width: "100%",
                }}
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
                if (!EMAIL_FORMAT.test(value)) {
                  return t(
                    "page.user.sign_up.error_message.email.invalid_pattern",
                  )
                }
                return value === "root"
                  ? true
                  : EMAIL_FORMAT.test(value)
                    ? true
                    : t("page.user.sign_up.error_message.email.invalid_pattern")
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
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                style={{
                  width: "100%",
                }}
                size="large"
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
              message={formState?.errors.password?.message || errorMsg.password}
            />
          )}
        </section>

        <div css={forgotPwdStyle}>
          <LinkButton
            style={{
              marginRight: 8,
            }}
            onClick={handleClickForgotPassword}
          >
            {t("page.user.sign_in.description.forgot_password")}
          </LinkButton>
        </div>
        <Button
          type="primary"
          size="large"
          loading={loading}
          block
          onClick={validReport}
        >
          {t("page.user.sign_in.actions.login")}
        </Button>
      </form>
      <div css={oAuthButtonGroupStyle}>
        <OAuthButton
          icon={<Icon component={GithubIcon} css={oAuthIconStyle} />}
          type="github"
          isMobile
          landing="signin"
        />
      </div>
    </div>
  )
}

MobileLogin.displayName = "MobileLogin"
