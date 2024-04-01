import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { editPanelUpdateFileDetailStore } from "@/utils/drive"
import { AgentWSContext } from "../../../context/AgentWSContext"
import { IAgentForm, SCROLL_ID } from "../../interface"
import { handleScrollToElement } from "../../utils"
import { IStartButtonProps } from "./interface"

const StartButton: FC<IStartButtonProps> = (props) => {
  const { t } = useTranslation()

  const { isConnecting, isRunning, reconnect, connect, lastRunAgent } =
    useContext(AgentWSContext)

  const { clearErrors, getValues, setError, reset } =
    useFormContext<IAgentForm>()

  const handleVerifyOnStart = () => {
    clearErrors()
    if (!getValues("prompt")) {
      setError("prompt", {
        type: "required",
        message: t("editor.ai-agent.validation_blank.prompt"),
      })
      handleScrollToElement(SCROLL_ID.PROMPT)
      return false
    } else if (
      !getValues("variables").every(
        (param) =>
          (param.key === "" && param.value === "") ||
          (param.key !== "" && param.value !== ""),
      )
    ) {
      setError("variables", {
        type: "validate",
        message: t("editor.ai-agent.validation_blank.variable_value"),
      })
      handleScrollToElement(SCROLL_ID.VARIABLES)
      return false
    } else if (editPanelUpdateFileDetailStore.hasPendingFile()) {
      setError("knowledge", {
        type: "knowledge",
        message: t("dashboard.message.parsing_file_in_prog"),
      })
      handleScrollToElement(SCROLL_ID.KNOWLEDGE)
      return false
    }
    return true
  }

  const handleClickStart = async () => {
    if (!handleVerifyOnStart()) {
      return
    }

    isRunning ? await reconnect() : await connect()
    reset(lastRunAgent.current)
    props.onClickCallback?.()
  }
  return (
    <Button
      block
      size="large"
      type="default"
      loading={isConnecting}
      icon={
        isRunning ? (
          <Icon component={ResetIcon} />
        ) : (
          <Icon component={PlayFillIcon} />
        )
      }
      onClick={handleClickStart}
    >
      {!isRunning ? t("editor.ai-agent.start") : t("editor.ai-agent.restart")}
    </Button>
  )
}

export default StartButton
