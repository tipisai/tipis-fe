import { memo, useState } from "react"
import { useFormContext, useFormState, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import BlackButton from "@/components/BlackButton"
import { editPanelUpdateFileDetailStore } from "@/utils/drive"
import { IAgentForm, SCROLL_ID } from "../../interface"
import { handleScrollToElement, useSubmitSaveAgent } from "../../utils"

const SaveButton = memo(() => {
  const { control, trigger, getValues } = useFormContext<IAgentForm>()
  const { errors, isDirty } = useFormState({ control })
  const [aiAgentID] = useWatch({
    control,
    name: ["aiAgentID"],
  })
  const { t } = useTranslation()
  const handleSubmitSave = useSubmitSaveAgent()
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyOnSave = async () => {
    setIsLoading(true)
    await trigger()
    let validate = true
    if (!!errors.name) {
      handleScrollToElement(SCROLL_ID.NAME)
      validate = false
    } else if (!!errors.description) {
      handleScrollToElement(SCROLL_ID.DESCRIPTION)
      validate = false
    } else if (!!errors.prompt) {
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
      const agentInfo = getValues()
      await handleSubmitSave(agentInfo)
      editPanelUpdateFileDetailStore.clearStore()
    }
    setIsLoading(false)

    return validate
  }

  return (
    <BlackButton
      id="save-button"
      onClick={handleVerifyOnSave}
      size="large"
      loading={isLoading}
      block
      type="primary"
      disabled={!!aiAgentID && !isDirty}
    >
      {t("editor.ai-agent.save")}
    </BlackButton>
  )
})

SaveButton.displayName = "SaveButton"

export default SaveButton
