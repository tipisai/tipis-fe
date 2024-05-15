import Icon from "@ant-design/icons"
import { App } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetIdentifiersQuery,
  useLinkIdentityMutation,
  useUnlinkIdentityMutation,
} from "@illa-public/user-data"
import GithubIcon from "@/assets/public/github.svg?react"
import GoogleIcon from "@/assets/public/googleIcon.svg?react"
import { Header } from "@/page/SettingPage/components/Header"
import { LinkCard } from "../components/LinkCard"
import { ILinkProvider } from "../interface"
import { cardContainerStyle, containerStyle } from "./style"

const PCLinkedSetting: FC = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const { data, isLoading } = useGetIdentifiersQuery(null)
  const [linkIdentity] = useLinkIdentityMutation()
  const [unLinkIdentity] = useUnlinkIdentityMutation()

  const providers = data?.map((identify) => identify.provider) || []

  const handleConnect = async (provider: ILinkProvider) => {
    try {
      await linkIdentity({
        provider,
        redirectTo: window.location.href,
      }).unwrap()
    } catch (e) {
      console.error(e)
    }
  }

  const handleDisconnect = async (provider: ILinkProvider) => {
    try {
      const identify = data?.find((identify) => identify.provider === provider)!
      await unLinkIdentity(identify).unwrap()
    } catch (e) {
      console.log(e)
    }
  }

  const handleClick = (provider: ILinkProvider) => {
    if (!providers?.includes(provider)) {
      handleConnect(provider)
    } else if (providers.length === 1) {
      message.error(
        "profile.setting.oauth.disconnect.not_disconnect_last_oauth",
      )
    } else {
      handleDisconnect(provider)
    }
  }

  if (isLoading) return null
  return (
    <div css={containerStyle}>
      <Header title={t("profile.setting.oauth.title.oauth")} />
      <div css={cardContainerStyle}>
        <LinkCard
          title="Github"
          description={t("profile.setting.oauth.description.GitHub_unconnect")}
          icon={<Icon component={GithubIcon} />}
          handleClick={() => handleClick("github")}
          isConnected={!!providers?.includes("github")}
        />
        <LinkCard
          title="Google"
          description={t("profile.setting.oauth.description.google")}
          icon={<Icon component={GoogleIcon} />}
          handleClick={() => handleClick("google")}
          isConnected={!!providers?.includes("google")}
        />
      </div>
    </div>
  )
}

export default PCLinkedSetting
