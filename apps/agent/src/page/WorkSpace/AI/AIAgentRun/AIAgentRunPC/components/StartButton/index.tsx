import Icon from "@ant-design/icons"
import { FC, useContext } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import BlackButton from "@/components/BlackButton"
import { IAgentForm } from "../../../../AIAgent/interface"
import { AgentWSContext } from "../../../../context/AgentWSContext"
import { InputVariablesModalContext } from "../../context/InputVariablesModalContext"

const StartButton: FC = () => {
  const { isConnecting, isRunning, reconnect, connect } =
    useContext(AgentWSContext)
  const { control } = useFormContext<IAgentForm>()

  const { t } = useTranslation()
  const { changeCanOpenModal, changeIsModalOpen } = useContext(
    InputVariablesModalContext,
  )
  const [variables] = useWatch({
    control,
    name: ["variables"],
  })

  const onClickStart = () => {
    if (variables.length > 0) {
      changeIsModalOpen(true)
      changeCanOpenModal(false)
    } else {
      isRunning ? reconnect() : connect()
    }
  }

  return (
    <BlackButton
      size="large"
      loading={isConnecting}
      icon={
        isRunning ? (
          <Icon component={ResetIcon} />
        ) : (
          <Icon component={PlayFillIcon} />
        )
      }
      onClick={onClickStart}
    >
      {!isRunning ? t("editor.ai-agent.start") : t("editor.ai-agent.restart")}
    </BlackButton>
  )
}

export default StartButton
