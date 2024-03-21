import Icon from "@ant-design/icons"
import { FC, useContext } from "react"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import BlackButton from "@/components/BlackButton"
import { ChatUnStableWSContext } from "../../context"

const StartButton: FC = () => {
  const { isConnecting, isRunning } = useContext(ChatUnStableWSContext)

  const { t } = useTranslation()

  return (
    <BlackButton
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
    </BlackButton>
  )
}

export default StartButton
