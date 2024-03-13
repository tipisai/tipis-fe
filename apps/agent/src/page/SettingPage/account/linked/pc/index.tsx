import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { GithubIcon } from "@illa-public/icon"
import { getCurrentUser } from "@illa-public/user-data"
import { Header } from "@/page/SettingPage/components/Header"
import { LinkCard } from "../components/LinkCard"
import { cardContainerStyle, containerStyle } from "./style"

export const PCLinkedSetting: FC = () => {
  const { t } = useTranslation()

  const userInfo = useSelector(getCurrentUser)
  const ssoVerified = userInfo?.ssoVerified
  const hasPassword = userInfo?.isPasswordSet

  return (
    <div css={containerStyle}>
      <Header title={t("profile.setting.oauth.title.oauth")} />
      <div css={cardContainerStyle}>
        <LinkCard
          title="Github"
          description={t("profile.setting.oauth.description.GitHub_unconnect")}
          icon={<Icon component={GithubIcon} />}
          type="github"
          isConnected={ssoVerified?.github ?? false}
          hasPassword={hasPassword}
        />
      </div>
    </div>
  )
}
