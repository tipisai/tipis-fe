import Icon from "@ant-design/icons"
import { FC } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useMatch } from "react-router-dom"
import { TipisTrack } from "@illa-public/track-utils"
import LogoIcon from "@/assets/public/logo.svg?react"
import LinkButton from "@/components/LinkButton"
import { LOGIN_PATH } from "@/utils/routeHelper"
import { DOC_PREFIX } from "../../constants"
import { LayoutProps } from "../interface"
import {
  contentStyle,
  headerStyle,
  layoutStyle,
  logoStyle,
  policyStyle,
  titleStyle,
} from "./style"

const MobileUserLayout: FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation()

  const matchLoginPath = useMatch(LOGIN_PATH)

  const parameter1 = matchLoginPath ? "login" : "sign_up"

  const handlePrivacyClick = () => {
    TipisTrack.track("click_privacy", { parameter1 })
  }

  const handleTermsServiceClick = () => {
    TipisTrack.track("click_terms", { parameter1 })
  }

  return (
    <div css={layoutStyle}>
      <div css={headerStyle}>
        <Icon component={LogoIcon} css={logoStyle} />
        <h1 css={titleStyle}>tipis.AI</h1>
      </div>
      <div css={contentStyle}>{children}</div>
      <div css={policyStyle}>
        <Trans
          i18nKey="page.user.policy"
          t={t}
          components={[
            <LinkButton
              key="/privacy-policy"
              href={`${DOC_PREFIX}/privacy-policy`}
              target="__blank"
              onClick={handlePrivacyClick}
              style={{
                height: 17,
              }}
            />,
            <LinkButton
              key="/terms-of-service"
              href={`${DOC_PREFIX}/terms-of-service`}
              style={{
                height: 17,
              }}
              onClick={handleTermsServiceClick}
              target="__blank"
            />,
          ]}
        />
      </div>
    </div>
  )
}

export default MobileUserLayout
