import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { GithubIcon } from "@illa-public/icon"
import ErrorMessage from "@/components/InputErrorMessage"
import LinkButton from "@/components/LinkButton"
import { FORGOT_PASSWORD_PATH, REGISTER_PATH } from "@/utils/routeHelper"
import { OAuthButton } from "../../components/OAuthButton"
import { CAN_SHOW_OAUTH, EMAIL_FORMAT } from "../../constants"
import { LoginFields } from "../../interface"
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
  const { handleSubmit, control, formState, trigger } =
    useFormContext<LoginFields>()
  const [_asyncValid, setAsyncValid] = useState<
    { isValid: boolean } | undefined
  >()

  const validReport = async () => {
    let isValid = await trigger()
    if (isValid) {
    }
    setAsyncValid({ isValid })
  }

  const handleClickRegister = () => {
    navigate({ pathname: REGISTER_PATH, search: location.search })
  }
  const handleClickForgotPassword = () => {
    navigate({
      pathname: FORGOT_PASSWORD_PATH,
      search: location.search,
    })
  }

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
          htmlType="submit"
          onClick={validReport}
        >
          {t("page.user.sign_in.actions.login")}
        </Button>
      </form>
      {CAN_SHOW_OAUTH && (
        <div css={oAuthButtonGroupStyle}>
          <OAuthButton
            icon={<Icon component={GithubIcon} css={oAuthIconStyle} />}
            type="github"
            isMobile
            landing="signin"
          />
        </div>
      )}
    </div>
  )
}

MobileLogin.displayName = "MobileLogin"
