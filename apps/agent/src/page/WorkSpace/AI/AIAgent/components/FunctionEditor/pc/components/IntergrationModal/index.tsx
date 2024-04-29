import { Modal } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { IntegrationTypeSelector } from "@/Modules/Integration/IntegrationSelector"
import { useNavigateToCreateFunction } from "@/utils/routeHelper/hook"
import { IIntergrationModalProps } from "./interface"

const IntergrationModal: FC<IIntergrationModalProps> = ({
  integrationVisible,
  onCancel,
}) => {
  const { t } = useTranslation()
  const navigateToCreateFunction = useNavigateToCreateFunction()

  return (
    <Modal
      open={integrationVisible}
      destroyOnClose
      width={1080}
      footer={false}
      title={t("editor.action.modal.title")}
      onCancel={onCancel}
    >
      <IntegrationTypeSelector onSelect={navigateToCreateFunction} />
    </Modal>
  )
}

export default IntergrationModal
