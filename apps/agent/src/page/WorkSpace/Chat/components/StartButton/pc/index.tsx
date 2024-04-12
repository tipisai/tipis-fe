import Icon from "@ant-design/icons"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import BlackButton from "@/components/BlackButton"
import { ChatStableWSContext, ChatUnStableWSContext } from "../../../context"

const PCStartButton: FC = () => {
  const { isConnecting, isRunning, chatMessages } = useContext(
    ChatUnStableWSContext,
  )
  const { reconnect, connect } = useContext(ChatStableWSContext)

  const { t } = useTranslation()

  return (
    <BlackButton
      size="large"
      htmlType="submit"
      type="primary"
      loading={isConnecting}
      onClick={isRunning ? reconnect : connect}
      disabled={chatMessages.length === 0}
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
