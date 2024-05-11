import { Divider, Typography } from "antd"
import { FC } from "react"
import { Helmet } from "react-helmet-async"
import { Trans, useTranslation } from "react-i18next"
import { TipisTrack } from "@illa-public/track-utils"
import TextAndLogo from "@/assets/public/textLogo.svg?react"
import EmailAuth from "@/page/UserAuth/components/EmailAuth"
import GithubAuthButton from "@/page/UserAuth/components/GithubAuthButton"
import GoogleAuthButton from "@/page/UserAuth/components/GoogleAuthButton"
import { DOC_PREFIX } from "../../constants"
import { IInputPageProps } from "./interface"
import {
  authButtonContainerStyle,
  inputPageContainerStyle,
  logoStyle,
  policyStyle,
  titleStyle,
} from "./style"

const InputPage: FC<IInputPageProps> = ({ setAuthStep }) => {
  const { t } = useTranslation()
  const handlePrivacyClick = () => {
    TipisTrack.track("click_privacy")
  }

  const handleTermsServiceClick = () => {
    TipisTrack.track("click_terms")
  }

  return (
    <>
      <Helmet>
        <title>{t("page.user.new_auth.title")}</title>
      </Helmet>
      <div css={inputPageContainerStyle}>
        <TextAndLogo css={logoStyle} />
        <h1 css={titleStyle}>{t("page.user.new_auth.title")}</h1>
        <div css={authButtonContainerStyle}>
          <GoogleAuthButton />
          <GithubAuthButton />
        </div>
        <Divider
          style={{
            margin: "0",
          }}
        />
        <EmailAuth setAuthStep={setAuthStep} />
        <span css={policyStyle}>
          <Trans
            i18nKey="page.user.new_auth.policy"
            t={t}
            components={[
              <Typography.Link
                key="/privacy-policy"
                href={`${DOC_PREFIX}/privacy-policy`}
                target="__blank"
                onClick={handlePrivacyClick}
                style={{
                  fontSize: 12,
                }}
              />,
              <Typography.Link
                key="/terms-of-service"
                href={`${DOC_PREFIX}/terms-of-service`}
                target="__blank"
                onClick={handleTermsServiceClick}
                style={{
                  fontSize: 12,
                }}
              />,
            ]}
          />
        </span>
      </div>
    </>
  )
}

export default InputPage
