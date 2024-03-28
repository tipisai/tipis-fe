import { memo, useState } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import BlackButton from "@/components/BlackButton"
import { IAgentForm, SCROLL_ID } from "../../interface"
import PublishModal from "../../pc/modules/PublishModal"
import { handleScrollToElement } from "../../utils"
import { saveButtonContainerStyle } from "./style"

const SaveButton = memo(() => {
  const { control, trigger } = useFormContext<IAgentForm>()
  const { isSubmitting, errors, isDirty } = useFormState({ control })
  const [aiAgentID] = useWatch({
    control,
    name: ["aiAgentID"],
  })
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)

  const handleVerifyOnSave = async () => {
    await trigger()
    let validate = true
    if (!!errors.prompt) {
      handleScrollToElement(SCROLL_ID.PROMPT)
      validate = false
    } else if (!!errors.knowledge) {
      handleScrollToElement(SCROLL_ID.KNOWLEDGE)
      validate = false
    } else if (!!errors.variables) {
      handleScrollToElement(SCROLL_ID.VARIABLES)
      validate = false
    }
    if (validate) {
      setModalOpen(true)
    }
    return validate
  }

  return (
    <div css={saveButtonContainerStyle}>
      <BlackButton
        id="save-button"
        onClick={handleVerifyOnSave}
        size="large"
        loading={isSubmitting}
        block
        type="primary"
        disabled={!!aiAgentID && !isDirty}
      >
        {t("editor.ai-agent.save")}
      </BlackButton>
      <PublishModal open={modalOpen} changeOpen={setModalOpen} />
    </div>
  )
})

SaveButton.displayName = "SaveButton"

export default SaveButton
