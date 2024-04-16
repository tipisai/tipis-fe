import Icon from "@ant-design/icons"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import BlackButton from "@/components/BlackButton"
import { ChatStableWSContext, ChatUnStableWSContext } from "../../../context"

const PCStartButton: FC = () => {
  const { isConnecting, isRunning, chatMessages, getReadyState } = useContext(
    ChatUnStableWSContext,
  )
  const { reconnect, connect } = useContext(ChatStableWSContext)

  const disabledClick =
    chatMessages.length === 0 ||
    (isRunning &&
      getReadyState() !== WS_READYSTATE.CONNECTING &&
      getReadyState() !== WS_READYSTATE.OPEN)

  const { t } = useTranslation()

  return (
    <BlackButton
      size="large"
      htmlType="submit"
      type="primary"
      loading={isConnecting}
      onClick={isRunning ? reconnect : connect}
      disabled={disabledClick}
      icon={
        isRunning ? (
          <Icon component={ResetIcon} />
        ) : (
          <Icon component={PlayFillIcon} />
        )
      }
    >
      {!isRunning
        ? t("editor.ai-agent.start")
        : t("homepage.tipi_chat.clear_all")}
    </BlackButton>
  )
}

export default PCStartButton
