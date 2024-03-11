import Icon from "@ant-design/icons"
import { ConfigProvider } from "antd"
import { FC, useContext } from "react"
import { Trans, useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import Logo from "@/assets/public/logo.svg?react"
import LinkButton from "../../components/LinkButton"
import { DOC_PREFIX } from "../../constants"
import { LayoutProps } from "../interface"
import {
  bottomWrapperStyle,
  layoutWrapperStyle,
  logoStyle,
  policyStyle,
  sloganStyle,
  topWrapperStyle,
} from "./style"

export const UserLayout: FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation()
  const { track } = useContext(MixpanelTrackContext)

  const handleLinkClick = (link: string) => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: /privacy/.test(link) ? "privacy" : "terms",
    })
  }

  return (
    <div css={layoutWrapperStyle}>
      <div css={topWrapperStyle}>
        <Icon component={Logo} css={logoStyle} />
        <span css={sloganStyle}>tipis.AI</span>
      </div>
      <div css={bottomWrapperStyle}>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                inputFontSizeLG: 14,
                paddingBlockLG: 9,
                paddingInlineLG: 16,
              },
              Button: {
                fontSizeLG: 14,
              },
            },
          }}
        >
          {children}
        </ConfigProvider>
        <span css={policyStyle}>
          <Trans
            i18nKey="page.user.policy"
            t={t}
            components={[
              <LinkButton
                key="/privacy-policy"
                href={`${DOC_PREFIX}/privacy-policy`}
                target="__blank"
                onClick={() => {
                  handleLinkClick("/privacy-policy")
                }}
              />,
              <LinkButton
                key="/terms-of-service"
                href={`${DOC_PREFIX}/terms-of-service`}
                target="__blank"
                onClick={() => {
                  handleLinkClick("/terms-of-service")
                }}
              />,
            ]}
          />
        </span>
      </div>
    </div>
  )
}

UserLayout.displayName = "UserLayout"
