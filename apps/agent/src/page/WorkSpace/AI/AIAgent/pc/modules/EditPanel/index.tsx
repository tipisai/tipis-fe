import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import EditPanelLayout from "@/Layout/EditPanelLayout"
import { editPanelUpdateFileDetailStore } from "@/utils/drive"
import { track } from "@/utils/mixpanelHelper"
import { AgentWSContext } from "../../../../context/AgentWSContext"
import KnowledgeEditor from "../../../components/KnowledgeEditor"
import PromptEditor from "../../../components/PromptEditor"
import VariableEditor from "../../../components/VariableEditor"
import { IAgentForm, SCROLL_ID } from "../../../interface"
import { agentData2JSONReport, handleScrollToElement } from "../../../utils"

const PCEditPanel: FC = () => {
  const { t } = useTranslation()

  const { isConnecting, isRunning, reconnect, connect } =
    useContext(AgentWSContext)

  const { clearErrors, getValues, setError } = useFormContext<IAgentForm>()

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
    // TODO: billing
    // if (isPremiumModel(getValues("model")) && !canUseBillingFeature) {
    //   upgradeModal({
    //     modalType: "agent",
    //     from: "agent_run_gpt4",
    //   })
    //   return
    // }
    track(
      ILLA_MIXPANEL_EVENT_TYPE.CLICK,
      ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_EDIT,
      {
        element: isRunning ? "restart" : "start",
        parameter1: agentData2JSONReport(getValues()),
        parameter5: getValues("aiAgentID") || "-1",
      },
    )
    isRunning ? await reconnect() : await connect()
  }

  return (
    <EditPanelLayout
      footerChildren={
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
          {!isRunning
            ? t("editor.ai-agent.start")
            : t("editor.ai-agent.restart")}
        </Button>
      }
    >
      <PromptEditor />
      <VariableEditor />
      <KnowledgeEditor />
    </EditPanelLayout>
  )
}

export default PCEditPanel
