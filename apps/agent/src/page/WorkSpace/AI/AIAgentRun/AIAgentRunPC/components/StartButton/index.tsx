import Icon from "@ant-design/icons"
import { FC, useContext } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { getCurrentId } from "@illa-public/user-data"
import BlackButton from "@/components/BlackButton"
import store from "@/redux/store"
import { removeChatMessageAndUIState } from "@/utils/localForage/uiState"
import { IAgentForm } from "../../../../AIAgent/interface"
import { AgentWSContext } from "../../../../context/AgentWSContext"
import { InputVariablesModalContext } from "../../context/InputVariablesModalContext"

const StartButton: FC = () => {
  const { isConnecting, isRunning, reconnect, connect } =
    useContext(AgentWSContext)
  const { control } = useFormContext<IAgentForm>()
  const { tabID } = useParams()

  const { t } = useTranslation()
  const { changeCanOpenModal, changeIsModalOpen } = useContext(
    InputVariablesModalContext,
  )
  const [variables] = useWatch({
    control,
    name: ["variables"],
  })

  const onClickStart = async () => {
    if (variables.length > 0) {
      changeIsModalOpen(true)
      changeCanOpenModal(false)
    } else {
      if (isRunning) {
        const currentTeamID = getCurrentId(store.getState())!
        await removeChatMessageAndUIState(currentTeamID, tabID!)
        reconnect()
      } else {
        connect()
      }
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
