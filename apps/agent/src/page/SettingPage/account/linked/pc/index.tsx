import Icon from "@ant-design/icons"
import { App } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import {
  useGetProvidersQuery,
  useLazyGetIdentifierQuery,
  useLinkIdentityMutation,
  useUnlinkIdentityMutation,
} from "@illa-public/user-data"
import GithubIcon from "@/assets/public/github.svg?react"
import GoogleIcon from "@/assets/public/googleIcon.svg?react"
import { Header } from "@/page/SettingPage/components/Header"
import { LinkCard } from "../components/LinkCard"
import { ILinkProvider } from "../interface"
import { cardContainerStyle, containerStyle } from "./style"

export const PCLinkedSetting: FC = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()

  const { data, isLoading } = useGetProvidersQuery(null)
  const [triggerGetIdentifier] = useLazyGetIdentifierQuery()
  const [linkIdentity] = useLinkIdentityMutation()
  const [unLinkIdentity] = useUnlinkIdentityMutation()

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
      const Identifier = await triggerGetIdentifier(provider).unwrap()
      await unLinkIdentity(Identifier).unwrap()
    } catch (e) {
      console.log(e)
    }
  }

  const handleClick = (provider: ILinkProvider) => {
    if (!data?.includes(provider)) {
      handleConnect(provider)
    } else if (data.length === 1) {
      message.error("just one")
      handleDisconnect(provider)
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
          isConnected={!!data?.includes("github")}
        />
        <LinkCard
          title="Google"
          description={t("profile.setting.oauth.description.GitHub_unconnect")}
          icon={<Icon component={GoogleIcon} />}
          handleClick={() => handleClick("google")}
          isConnected={!!data?.includes("google")}
        />
      </div>
    </div>
  )
}
