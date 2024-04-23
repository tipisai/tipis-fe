import { FC, useContext, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import EditPanelLayout from "@/Layout/EditPanelLayout"
import MobileFirstPageLayout from "@/Layout/Workspace/mobile/module/FistPageLayout"
import MobileSecondPageLayout from "@/Layout/Workspace/mobile/module/SecondPageLayout"
import { AgentWSContext } from "../../../../context/AgentWSContext"
import ContributeButton from "../../../components/ContributeButton"
import { IAgentForm } from "../../../interface"
import { EditPanelContent } from "../../../modules/EditPanel/content"
import PreviewChatHistory from "../../../modules/PreviewChatHistory"
import ActionGroup from "../ActionGroup"
import { MOBILE_EDIT_PAGE_STEP } from "./interface"
import { mobileEditPanelContainerStyle } from "./style"

const MobileEditPanel: FC = () => {
  const { control } = useFormContext<IAgentForm>()

  const { t } = useTranslation()
  const [aiAgentID, agentName] = useWatch({
    control,
    name: ["aiAgentID", "name"],
  })

  const { leaveRoom } = useContext(AgentWSContext)

  const [currentStep, setCurrentStep] = useState<MOBILE_EDIT_PAGE_STEP>(
    MOBILE_EDIT_PAGE_STEP.BASIC,
  )

  const onClickClosePreviewPage = () => {
    leaveRoom()
    setCurrentStep(MOBILE_EDIT_PAGE_STEP.BASIC)
  }

  const onClickStartCallback = () => {
    setCurrentStep(MOBILE_EDIT_PAGE_STEP.PREVIEW)
  }

  return (
    <>
      {currentStep === MOBILE_EDIT_PAGE_STEP.BASIC && (
        <MobileFirstPageLayout
          title={aiAgentID ? agentName : t("dashboard.button.blank-agent")}
          headerExtra={<ContributeButton isMobile />}
        >
          <EditPanelLayout
            customWidth="100%"
            canResize
            isMobile
            footerChildren={
              <ActionGroup onClickStartCallback={onClickStartCallback} />
            }
          >
            <div css={mobileEditPanelContainerStyle}>
              <EditPanelContent />
            </div>
          </EditPanelLayout>
        </MobileFirstPageLayout>
      )}
      {currentStep === MOBILE_EDIT_PAGE_STEP.PREVIEW && (
        <MobileSecondPageLayout
          title={t("homepage.edit_tipi.mobile_preview.preview")}
          onClickClose={onClickClosePreviewPage}
          headerExtra={<ContributeButton isMobile />}
        >
          <PreviewChatHistory />
        </MobileSecondPageLayout>
      )}
    </>
  )
}

export default MobileEditPanel
