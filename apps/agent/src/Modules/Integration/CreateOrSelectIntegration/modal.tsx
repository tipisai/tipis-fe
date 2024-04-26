import { Modal } from "antd"
import { FC, useState } from "react"
import IntegrationSelector from "."
import { IIntegrationSelectorModalProps } from "./interface"
import { customModalStyle } from "./style"
import { IntegrationSelectorContext } from "./utils"

const IntegrationSelectorModal: FC<IIntegrationSelectorModalProps> = (
  props,
) => {
  const { open, changeOpen, onConfirm, integrationType, integrationID } = props
  const [modalName, setModalName] = useState("")
  return (
    <IntegrationSelectorContext.Provider
      value={{
        modalName,
        setModalName,
      }}
    >
      <Modal
        open={open}
        destroyOnClose
        title={modalName}
        width={696}
        footer={false}
        css={customModalStyle}
        onCancel={() => {
          changeOpen(false)
        }}
      >
        <IntegrationSelector
          onConfirm={onConfirm}
          integrationType={integrationType}
          integrationID={integrationID}
        />
      </Modal>
    </IntegrationSelectorContext.Provider>
  )
}

export default IntegrationSelectorModal
