import { Button } from "antd"
import { memo, useState } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Agent } from "@illa-public/public-types"
import { SCROLL_ID } from "../../interface"
import PublishModal from "../../modules/PublishModal"
import { handleScrollToElement } from "../../utils"
import { saveButtonContainerStyle } from "./style"

const SaveButton = memo(() => {
  const { control, trigger } = useFormContext<Agent>()
  const { isSubmitting, errors } = useFormState({ control })
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
      <Button
        id="save-button"
        onClick={handleVerifyOnSave}
        size="large"
        loading={isSubmitting}
        block
        type="primary"
      >
        {t("editor.ai-agent.save")}
      </Button>
      <PublishModal open={modalOpen} changeOpen={setModalOpen} />
    </div>
  )
})

SaveButton.displayName = "SaveButton"

export default SaveButton
