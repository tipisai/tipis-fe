import { Modal } from "antd"
import { FC } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { TIntegrationType } from "@illa-public/public-types"
import { IntegrationTypeSelector } from "@/Modules/Integration/IntegrationSelector"
import { IAgentForm } from "@/page/WorkSpace/AI/AIAgent/interface"
import { getCurrentTabID } from "@/redux/ui/recentTab/selector"
import { CREATE_FUNCTION_FROM_SINGLE } from "@/utils/routeHelper"
import { useNavigateToCreateFunction } from "@/utils/routeHelper/hook"
import { IIntegrationModalProps } from "./interface"

const IntegrationModal: FC<IIntegrationModalProps> = ({
  integrationVisible,
  onCancel,
}) => {
  const { t } = useTranslation()
  const navigateToCreateFunction = useNavigateToCreateFunction()
  const { getValues } = useFormContext<IAgentForm>()
  const currentTabID = useSelector(getCurrentTabID)
  const handleSelect = (functionType: TIntegrationType) => {
    const from = !!getValues("aiAgentID")
      ? CREATE_FUNCTION_FROM_SINGLE.EDIT_TIPIS
      : CREATE_FUNCTION_FROM_SINGLE.CREATE_TIPIS
    navigateToCreateFunction(functionType, from, currentTabID)
  }

  return (
    <Modal
      open={integrationVisible}
      destroyOnClose
      width={1080}
      footer={false}
      title={t("editor.action.modal.title")}
      onCancel={onCancel}
    >
      <IntegrationTypeSelector onSelect={handleSelect} />
    </Modal>
  )
}

export default IntegrationModal
