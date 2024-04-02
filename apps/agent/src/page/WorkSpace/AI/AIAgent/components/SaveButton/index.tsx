import { memo, useState } from "react"
import {
  FieldErrors,
  useFormContext,
  useFormState,
  useWatch,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { TipisTrack } from "@illa-public/track-utils"
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
    TipisTrack.track("click_save", {
      parameter1: aiAgentID ? "edit" : "create",
    })
    setIsLoading(true)
    await trigger()
    let validate = true
    let reportedErrors: string[] = []
    Object.keys(errors).forEach((key: string) => {
      const error = errors[key as keyof FieldErrors<IAgentForm>]
      if (error && error.type === "required") {
        reportedErrors.push(`${key}_blank`)
      }
      if (error && error.type === "validate" && key === "variables") {
        reportedErrors.push("variable_key_or_value_blank")
      }
    })
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
    TipisTrack.track("validate_save", {
      parameter1: aiAgentID ? "edit" : "create",
      parameter2: validate ? "suc" : "failed",
      parameter3: reportedErrors,
    })
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
      {!!aiAgentID
        ? t("editor.ai-agent.save")
        : t("homepage.edit_tipi.modal.create")}
    </BlackButton>
  )
})

SaveButton.displayName = "SaveButton"

export default SaveButton
