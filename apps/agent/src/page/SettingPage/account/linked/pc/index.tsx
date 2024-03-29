import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { GithubIcon } from "@illa-public/icon"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { Header } from "@/page/SettingPage/components/Header"
import { LinkCard } from "../components/LinkCard"
import { cardContainerStyle, containerStyle } from "./style"

export const PCLinkedSetting: FC = () => {
  const { t } = useTranslation()

  const { data } = useGetUserInfoQuery(null)
  const ssoVerified = data?.ssoVerified
  const hasPassword = data?.isPasswordSet

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
          hasPassword={hasPassword ?? false}
        />
      </div>
    </div>
  )
}
