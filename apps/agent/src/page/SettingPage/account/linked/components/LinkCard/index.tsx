import { App, Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useCancelLinkedMutation } from "@illa-public/user-data"
import { useLazyGetOAuthURIQuery } from "@illa-public/user-data"
import { SETTING_PASSWORD_PATH } from "@/router/constants"
import { OAUTH_REDIRECT_URL } from "@/utils/oauth"
import { LinkCardProps } from "./interface"
import {
  buttonWrapperStyle,
  containerStyle,
  descriptionStyle,
  headerContainerStyle,
  iconContainerStyle,
  titleContainerStyle,
  titleStyle,
} from "./style"

export const LinkCard: FC<LinkCardProps> = (props) => {
  const { icon, title, description, type, isConnected, hasPassword } = props
  const { t } = useTranslation()
  const { message, modal } = App.useApp()
  const [connectedLoading, setConnectedLoading] = useState(false)
  const navigate = useNavigate()
  const [triggerGetOAuthURI] = useLazyGetOAuthURIQuery()
  const [cancelLinked] = useCancelLinkedMutation()

  const tipsNotHasPassword = () => {
    const tipsModal = modal.confirm({
      title: t("profile.setting.oauth.modal.title"),
      okText: t("profile.setting.oauth.modal.set_button"),
      cancelText: t("profile.setting.oauth.modal.cancel_button"),
      content: t("profile.setting.oauth.modal.description"),
      onOk: () => {
        tipsModal.update({
          open: false,
        })

        navigate(SETTING_PASSWORD_PATH)
      },
      onCancel: () => {
        tipsModal.update({
          open: false,
        })
      },
    })
  }

  const handleDisconnect = async () => {
    if (!hasPassword) {
      tipsNotHasPassword()
      return
    }
    try {
      setConnectedLoading(true)
      await cancelLinked(type)
      message.success({
        content: t("profile.setting.oauth.message.disconnect_suc"),
      })
    } catch (e) {
      message.error({
        content: t("profile.setting.oauth.message.disconnect_failed"),
      })
    } finally {
      setConnectedLoading(false)
    }
  }

  const handleConnect = async () => {
    try {
      setConnectedLoading(true)
      const OAuthURIResponse = await triggerGetOAuthURI({
        oauthAgency: type,
        landing: "connect",
        redirectURI: OAUTH_REDIRECT_URL,
      }).unwrap()
      const { uri } = OAuthURIResponse
      window.open(uri, "_self")
    } catch (e) {
    } finally {
      setConnectedLoading(false)
    }
  }

  return (
    <div css={containerStyle}>
      <div css={headerContainerStyle}>
        <div css={titleContainerStyle}>
          <span css={iconContainerStyle}>{icon}</span>
          <span css={titleStyle}>{title}</span>
        </div>
        <span css={descriptionStyle}>{description}</span>
      </div>
      <span css={buttonWrapperStyle}>
        {isConnected ? (
          <Button
            size="large"
            loading={connectedLoading}
            onClick={handleDisconnect}
          >
            {t("profile.setting.oauth.button.disconnect")}
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={handleConnect}
            loading={connectedLoading}
          >
            {t("profile.setting.oauth.button.connect")}
          </Button>
        )}
      </span>
    </div>
  )
}
