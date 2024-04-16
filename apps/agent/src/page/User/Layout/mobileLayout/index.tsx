import { Typography } from "antd"
import { FC } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useMatch } from "react-router-dom"
import { TipisTrack } from "@illa-public/track-utils"
import TextAndLogo from "@/assets/public/textLogo.svg?react"
import { LOGIN_PATH } from "@/utils/routeHelper"
import { DOC_PREFIX } from "../../constants"
import { LayoutProps } from "../interface"
import {
  contentStyle,
  headerStyle,
  layoutStyle,
  logoStyle,
  policyStyle,
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
        <TextAndLogo css={logoStyle} />
      </div>
      <div css={contentStyle}>{children}</div>
      <div css={policyStyle}>
        <Trans
          i18nKey="page.user.policy"
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
              onClick={handleTermsServiceClick}
              target="__blank"
              style={{
                fontSize: 12,
              }}
            />,
          ]}
        />
      </div>
    </div>
  )
}

export default MobileUserLayout
