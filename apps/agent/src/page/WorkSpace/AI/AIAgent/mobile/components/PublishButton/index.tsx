import { memo, useState } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import BlackButton from "@/components/BlackButton"
import { IAgentForm } from "../../../interface"
import { useSubmitSaveAgent } from "../../../utils"
import { ISaveButtonProps } from "./interface"

const SaveButton = memo((props: ISaveButtonProps) => {
  const { onClickSaveCallback } = props
  const { control, trigger, getValues } = useFormContext<IAgentForm>()
  const { errors } = useFormState({ control })
  const { t } = useTranslation()
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
        onClickSaveCallback()
      } catch {}
    }
    setIsLoading(false)
  }

  return (
    <BlackButton
      id="save-button"
      onClick={handleVerifyOnSave}
      size="large"
      loading={isLoading}
      type="primary"
    >
      {t("editor.ai-agent.save")}
    </BlackButton>
  )
})

SaveButton.displayName = "PreviewButton"

export default SaveButton
