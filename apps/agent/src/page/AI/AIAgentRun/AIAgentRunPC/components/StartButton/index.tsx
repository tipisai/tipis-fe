import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { AgentWSContext } from "../../../../context/AgentWSContext"

const StartButton: FC = () => {
  const { isConnecting, isRunning } = useContext(AgentWSContext)

  const { t } = useTranslation()

  return (
    <Button
      size="large"
      htmlType="submit"
      type="primary"
      loading={isConnecting}
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
