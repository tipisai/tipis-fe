import { Modal } from "antd"
import { FC } from "react"
import CreateOrSelectIntegration from "."
import { ICreateOrSelectIntegrationModalProps } from "./interface"
import { customModalStyle } from "./style"

const CreateOrSelectIntegrationModal: FC<
  ICreateOrSelectIntegrationModalProps
> = (props) => {
  const { open, changeOpen, onConfirm, integrationType } = props
  return (
    <Modal
      open={open}
      destroyOnClose
      title="dddddd"
      width={696}
      footer={false}
      css={customModalStyle}
      onCancel={() => {
        changeOpen(false)
      }}
    >
      <CreateOrSelectIntegration
        onConfirm={onConfirm}
        integrationType={integrationType}
      />
    </Modal>
  )
}

export default CreateOrSelectIntegrationModal
