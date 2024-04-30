import { Modal } from "antd"
import { FC, useEffect, useState } from "react"
import IntegrationSelector from "."
import { CREATE_INTEGRATION_EVENT } from "../../../utils/eventEmitter/constants"
import { IntegrationEventEmitter } from "../../../utils/function"
import { IIntegrationSelectorModalProps } from "./interface"
import { SELECT_INTEGRATION_STEP } from "./modules/SelectAndCreate/interface"
import { customModalStyle } from "./style"
import { IntegrationSelectorContext } from "./utils"

const IntegrationSelectorModal: FC<IIntegrationSelectorModalProps> = (
  props,
) => {
  const { open, changeOpen, onConfirm, integrationType, integrationID } = props

  const [modalName, setModalName] = useState("")

  const [defaultStep, setDefaultStep] = useState(
    SELECT_INTEGRATION_STEP.SELECT_OR_CREATE,
  )

  useEffect(() => {
    IntegrationEventEmitter.on(
      CREATE_INTEGRATION_EVENT.CHANGE_MODAL_STEP,
      setDefaultStep,
    )

    return () => {
      IntegrationEventEmitter.off(
        CREATE_INTEGRATION_EVENT.CHANGE_MODAL_STEP,
        setDefaultStep,
      )
    }
  }, [])

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
          defaultStep={defaultStep}
        />
      </Modal>
    </IntegrationSelectorContext.Provider>
  )
}

export default IntegrationSelectorModal
