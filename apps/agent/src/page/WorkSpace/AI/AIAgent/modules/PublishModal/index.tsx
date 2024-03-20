import { Modal } from "antd"
import { FC, useState } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { IAgentForm } from "../../interface"
import { useSubmitSaveAgent } from "../../utils"
import AvatarUploader from "./components/AvatarUploader"
import DescriptionEditor from "./components/DescriptionEditor"
import NameEditor from "./components/NameEditor"
import { IPublishModalProps } from "./interface"
import { publishModalContentStyle } from "./style"

const PublishModal: FC<IPublishModalProps> = (props) => {
  const { open, changeOpen } = props
  const { control, trigger, getValues } = useFormContext<IAgentForm>()
  const { errors } = useFormState({ control })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmitSave = useSubmitSaveAgent()

  const handleVerifyOnSave = async () => {
    setIsLoading(true)
    await trigger()
    let validate = true
    const agentInfo = getValues()

    if (!!errors.name) {
      validate = false
    } else if (!!errors.description) {
      validate = false
    } else if (!!errors.icon) {
      validate = false
    }
    if (validate) {
      try {
        await handleSubmitSave(agentInfo)
        changeOpen(false)
      } catch {}
    }
    setIsLoading(false)
  }

  return (
    <Modal
      title="Publish"
      onOk={handleVerifyOnSave}
      open={open}
      onCancel={() => {
        changeOpen(false)
      }}
      okButtonProps={{
        htmlType: "submit",
        loading: isLoading,
      }}
    >
      <div css={publishModalContentStyle}>
        <NameEditor />
        <DescriptionEditor />
        <AvatarUploader />
      </div>
    </Modal>
  )
}

export default PublishModal
