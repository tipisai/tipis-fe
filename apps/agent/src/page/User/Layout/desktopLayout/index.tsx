import { FC } from "react"
import { Trans, useTranslation } from "react-i18next"
import { useMatch } from "react-router-dom"
import { TipisTrack } from "@illa-public/track-utils"
import TextAndLogo from "@/assets/public/textLogo.svg?react"
import LinkButton from "@/components/LinkButton"
import { LOGIN_PATH } from "@/utils/routeHelper"
import { DOC_PREFIX } from "../../constants"
import { LayoutProps } from "../interface"
import {
  bottomWrapperStyle,
  layoutWrapperStyle,
  logoStyle,
  policyStyle,
  topWrapperStyle,
} from "./style"

const UserLayout: FC<LayoutProps> = ({ children }) => {
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
    <div css={layoutWrapperStyle}>
      <div css={topWrapperStyle}>
        <TextAndLogo css={logoStyle} />
      </div>
      <div css={bottomWrapperStyle}>
        {children}
        <span css={policyStyle}>
          <Trans
            i18nKey="page.user.policy"
            t={t}
            components={[
              <LinkButton
                key="/privacy-policy"
                href={`${DOC_PREFIX}/privacy-policy`}
                target="__blank"
                onClick={handlePrivacyClick}
              />,
              <LinkButton
                key="/terms-of-service"
                href={`${DOC_PREFIX}/terms-of-service`}
                target="__blank"
                onClick={handleTermsServiceClick}
              />,
            ]}
          />
        </span>
      </div>
    </div>
  )
}
export default UserLayout
