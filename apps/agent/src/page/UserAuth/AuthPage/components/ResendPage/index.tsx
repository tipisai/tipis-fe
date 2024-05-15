import { App, Button } from "antd"
import { FC, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useAuthByMagicLinkMutation } from "@illa-public/user-data"
import TextAndLogo from "@/assets/public/textLogo.svg?react"
import i18n from "@/i18n"
import EmailCountDown from "@/page/UserAuth/components/EmailCountDown"
import { AUTH_STEP, IEmailForm } from "../../interface"
import { IResendPageProps } from "./interface"
import {
  actionContainerStyle,
  descStyle,
  infoContainerStyle,
  logoStyle,
  resendPageContainerStyle,
  titleStyle,
} from "./style"

const ResendPage: FC<IResendPageProps> = ({ setAuthStep }) => {
  const { t } = useTranslation()
  const [disabled, setDisabled] = useState(true)
  const handleToInputPage = () => {
    setAuthStep(AUTH_STEP.INPUT_PAGE)
  }
  const { message } = App.useApp()

  const { getValues } = useFormContext<IEmailForm>()
  const [authByMagicLink] = useAuthByMagicLinkMutation()
  const handleRend = async () => {
    setDisabled(true)
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
      setDisabled(false)
    }
  }
  return (
    <>
      <Helmet>
        <title>{t("page.user.new_auth.email_link.title")}</title>
      </Helmet>
      <div css={resendPageContainerStyle}>
        <TextAndLogo css={logoStyle} />
        <div css={infoContainerStyle}>
          <h1 css={titleStyle}>{t("page.user.new_auth.email_link.title")}</h1>
          <span css={descStyle}>{t("page.user.new_auth.email_link.desc")}</span>
        </div>
        <div css={actionContainerStyle}>
          <Button
            block
            type="text"
            size="large"
            disabled={disabled}
            onClick={handleRend}
          >
            {disabled ? (
              <EmailCountDown onFinished={() => setDisabled(false)} />
            ) : (
              t("page.user.new_auth.email_link.resend")
            )}
          </Button>
          <Button block type="text" size="large" onClick={handleToInputPage}>
            {t("page.user.new_auth.email_link.back")}
          </Button>
        </div>
      </div>
    </>
  )
}

export default ResendPage
