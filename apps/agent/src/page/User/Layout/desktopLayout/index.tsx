import Icon from "@ant-design/icons"
import { FC } from "react"
import { Trans, useTranslation } from "react-i18next"
import Logo from "@/assets/public/logo.svg?react"
import LinkButton from "@/components/LinkButton"
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

const UserLayout: FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation()

  return (
    <div css={layoutWrapperStyle}>
      <div css={topWrapperStyle}>
        <Icon component={Logo} css={logoStyle} />
        <span css={sloganStyle}>tipis.AI</span>
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
              />,
              <LinkButton
                key="/terms-of-service"
                href={`${DOC_PREFIX}/terms-of-service`}
                target="__blank"
              />,
            ]}
          />
        </span>
      </div>
    </div>
  )
}
export default UserLayout
