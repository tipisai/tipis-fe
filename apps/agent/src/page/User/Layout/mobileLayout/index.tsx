import Icon from "@ant-design/icons"
import { FC, useContext } from "react"
import { Trans, useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import LogoIcon from "@/assets/public/logo.svg?react"
import LinkButton from "@/components/LinkButton"
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
  const { track } = useContext(MixpanelTrackContext)

  const handleLinkClick = (link: string) => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: /privacy/.test(link) ? "privacy" : "terms",
    })
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
              style={{
                height: 17,
              }}
              onClick={() => {
                handleLinkClick("/privacy-policy")
              }}
            />,
            <LinkButton
              key="/terms-of-service"
              href={`${DOC_PREFIX}/terms-of-service`}
              style={{
                height: 17,
              }}
              target="__blank"
              onClick={() => {
                handleLinkClick("/terms-of-service")
              }}
            />,
          ]}
        />
      </div>
    </div>
  )
}

export default MobileUserLayout
