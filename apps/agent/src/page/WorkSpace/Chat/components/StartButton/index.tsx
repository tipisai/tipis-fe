import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { ChatStableWSContext, ChatUnStableWSContext } from "../../context"

const StartButton: FC = () => {
  const { isConnecting, isRunning } = useContext(ChatUnStableWSContext)
  const { reconnect, connect } = useContext(ChatStableWSContext)

  const { t } = useTranslation()

  return (
    <Button
      size="large"
      htmlType="submit"
      type="primary"
      loading={isConnecting}
      onClick={isRunning ? reconnect : connect}
      icon={
        isRunning ? (
          <Icon component={ResetIcon} />
        ) : (
          <Icon component={PlayFillIcon} />
        )
      }
    >
      {!isRunning ? t("editor.ai-agent.start") : t("editor.ai-agent.restart")}
    </Button>
  )
}

export default StartButton
