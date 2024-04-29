import { Modal } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { TIntegrationType } from "@illa-public/public-types"
import { IntegrationTypeSelector } from "@/Modules/Integration/IntegrationSelector"
import { useAddCreateFunction } from "@/utils/recentTabs/hook"
import { IIntergrationModalProps } from "./interface"

const IntergrationModal: FC<IIntergrationModalProps> = ({
  integrationVisible,
  onCancel,
}) => {
  const { t } = useTranslation()
  const createFunction = useAddCreateFunction()

  return (
    <Modal
      open={integrationVisible}
      destroyOnClose
      width={1080}
      footer={false}
      title={t("editor.action.modal.title")}
      onCancel={onCancel}
    >
      <IntegrationTypeSelector
        onSelect={function (item: TIntegrationType): void {
          createFunction(item)
        }}
      />
    </Modal>
  )
}

export default IntergrationModal
