import Icon from "@ant-design/icons"
import { Modal } from "antd"
import { FC, useContext } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { getCurrentId } from "@illa-public/user-data"
import BlackButton from "@/components/BlackButton"
import store from "@/redux/store"
import { removeChatMessageAndUIState } from "@/utils/localForage/teamData"
import { IAgentForm } from "../../../AIAgent/interface"
import { AgentWSContext } from "../../../context/AgentWSContext"
import { InputVariablesModalContext } from "../../AIAgentRunPC/context/InputVariablesModalContext"
import InputVariableArea from "./inputArea"
import { modalBodyCOntainerStyle } from "./style"

const InputVariables: FC = () => {
  const { control, reset } = useFormContext<IAgentForm>()
  const { isModalOpen, changeCanOpenModal, changeIsModalOpen } = useContext(
    InputVariablesModalContext,
  )
  const { tabID } = useParams()
  const [variables] = useWatch({
    control,
    name: ["variables"],
  })

  const { isRunning, reconnect, connect, lastRunAgent } =
    useContext(AgentWSContext)
  const { t } = useTranslation()

  const onClickStart = async () => {
    changeIsModalOpen(false)
    changeCanOpenModal(false)
    const currentTeamID = getCurrentId(store.getState())!
    await removeChatMessageAndUIState(currentTeamID, tabID!, "run")
    isRunning ? await reconnect() : await connect()
    reset(lastRunAgent.current)
  }

  const onClickCancel = () => {
    changeIsModalOpen(false)
    changeCanOpenModal(false)
    if (isRunning && lastRunAgent) {
      reset(lastRunAgent.current)
    }
  }

  return (
    <Modal
      title="complete the information"
      open={isModalOpen}
      onCancel={onClickCancel}
      centered
      maskClosable={false}
      footer={
        <BlackButton
          size="large"
          block
          icon={
            isRunning ? (
              <Icon component={ResetIcon} />
            ) : (
              <Icon component={PlayFillIcon} />
            )
          }
          onClick={onClickStart}
        >
          {!isRunning
            ? t("editor.ai-agent.start")
            : t("editor.ai-agent.restart")}
        </BlackButton>
      }
    >
      <div css={modalBodyCOntainerStyle}>
        {variables.map((variable, index) => (
          <InputVariableArea
            key={index}
            variableName={variable.key}
            index={index}
          />
        ))}
      </div>
    </Modal>
  )
}

export default InputVariables
