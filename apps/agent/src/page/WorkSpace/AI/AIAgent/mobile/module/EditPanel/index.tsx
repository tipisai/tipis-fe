import { FC, useContext, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import EditPanelLayout from "@/Layout/EditPanelLayout"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import MobileSecondPageLayout from "@/Layout/Workspace/mobile/module/SecondPageLayout"
import BlackButton from "../../../../../../../components/BlackButton"
import { track } from "../../../../../../../utils/mixpanelHelper"
import { AgentWSContext } from "../../../../context/AgentWSContext"
import AvatarUploader from "../../../components/AvatarUploader"
import DescriptionEditor from "../../../components/DescriptionEditor"
import KnowledgeEditor from "../../../components/KnowledgeEditor"
import NameEditor from "../../../components/NameEditor"
import PromptEditor from "../../../components/PromptEditor"
import VariableEditor from "../../../components/VariableEditor"
import { IAgentForm, SCROLL_ID } from "../../../interface"
import PreviewChatHistory from "../../../modules/PreviewChatHistory"
import { agentData2JSONReport, handleScrollToElement } from "../../../utils"
import PreviewButton from "../../components/PreviewButton"
import SaveButton from "../../components/PublishButton"
import { MOBILE_EDIT_PAGE_STEP } from "./interface"
import { publishModalContentStyle } from "./style"

const MobileEditPanel: FC = () => {
  const { control, clearErrors, getValues, setError, trigger } =
    useFormContext<IAgentForm>()

  const { t } = useTranslation()
  const [aiAgentID, agentName] = useWatch({
    control,
    name: ["aiAgentID", "name"],
  })

  const { isRunning, connect, reconnect, leaveRoom } =
    useContext(AgentWSContext)

  const [currentStep, setCurrentStep] = useState<MOBILE_EDIT_PAGE_STEP>(
    MOBILE_EDIT_PAGE_STEP.BASIC,
  )

  const onClickClosePreviewPage = () => {
    leaveRoom()
    setCurrentStep(MOBILE_EDIT_PAGE_STEP.BASIC)
  }

  const onClickCloseEditInfoPage = async () => {
    isRunning ? await reconnect() : await connect()
    setCurrentStep(MOBILE_EDIT_PAGE_STEP.PREVIEW)
  }

  const handleVerifyOnStart = async () => {
    clearErrors()
    await trigger()
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
    } else if (
      Array.isArray(getValues("knowledge")) &&
      getValues("knowledge").length > 0 &&
      getValues("knowledge").some((param) => param.value === "")
    ) {
      setError("variables", {
        type: "knowledge",
        message: t("dashboard.message.parsing_file_in_prog"),
      })
      handleScrollToElement(SCROLL_ID.KNOWLEDGE)
      return false
    }
    return true
  }

  const handleClickStart = async () => {
    if (!(await handleVerifyOnStart())) {
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
    setCurrentStep(MOBILE_EDIT_PAGE_STEP.PREVIEW)
  }

  const handleClickPublish = async () => {
    leaveRoom()
    setCurrentStep(MOBILE_EDIT_PAGE_STEP.INFO)
  }

  return (
    <>
      {currentStep === MOBILE_EDIT_PAGE_STEP.BASIC && (
        <MobileFirstPageLayout
          title={aiAgentID ? agentName : t("new_dashboard.button.blank-agent")}
          headerExtra={
            <PreviewButton onClickPreviewCallback={handleClickStart} />
          }
        >
          <EditPanelLayout customWidth="100%" canResize>
            <PromptEditor />
            <VariableEditor />
            <KnowledgeEditor />
          </EditPanelLayout>
        </MobileFirstPageLayout>
      )}
      {currentStep === MOBILE_EDIT_PAGE_STEP.PREVIEW && (
        <MobileSecondPageLayout
          title={"Preview"}
          headerExtra={
            <BlackButton
              id="save-button"
              onClick={handleClickPublish}
              size="large"
              block
              type="primary"
            >
              {t("editor.ai-agent.publish")}
            </BlackButton>
          }
          onClickClose={onClickClosePreviewPage}
        >
          <PreviewChatHistory isMobile />
        </MobileSecondPageLayout>
      )}
      {currentStep === MOBILE_EDIT_PAGE_STEP.INFO && (
        <MobileSecondPageLayout
          title={"Save"}
          headerExtra={
            <SaveButton onClickSaveCallback={onClickCloseEditInfoPage} />
          }
          onClickClose={onClickCloseEditInfoPage}
        >
          <div css={publishModalContentStyle}>
            <AvatarUploader />
            <NameEditor />
            <DescriptionEditor />
          </div>
        </MobileSecondPageLayout>
      )}
    </>
  )
}

export default MobileEditPanel
