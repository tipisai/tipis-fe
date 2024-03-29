import { App, Button } from "antd"
import { FC, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { useCancelLinkedMutation } from "@illa-public/user-data"
import { useLazyGetOAuthURIQuery } from "@illa-public/user-data"
import { getPasswordPath } from "@/utils/routeHelper"
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
  const { track } = useContext(MixpanelTrackContext)
  const [triggerGetOAuthURI] = useLazyGetOAuthURIQuery()
  const [cancelLinked] = useCancelLinkedMutation()
  const { teamIdentifier } = useParams()

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
        track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
          element: "github_connect_modal_set_password",
        })
        // TODO: WTF, replace
        navigate(getPasswordPath(teamIdentifier!))
      },
      onCancel: () => {
        tipsModal.update({
          open: false,
        })
        track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
          element: "github_connect_modal_cancel",
        })
      },
    })
  }

  const handleDisconnect = async () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: `${type}_connect`,
      parameter1: "not_connected",
    })
    if (!hasPassword) {
      tipsNotHasPassword()
      return
    }
    try {
      setConnectedLoading(true)
      await cancelLinked(type)
      message.success({
        content: t("Disconnected"),
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
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: `${type}_connect`,
      parameter1: "connected",
    })
    try {
      setConnectedLoading(true)
      const OAuthURIResponse = await triggerGetOAuthURI({
        oauthAgency: type,
        landing: "connect",
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
