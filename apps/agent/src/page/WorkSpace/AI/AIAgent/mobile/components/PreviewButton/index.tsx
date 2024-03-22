import { memo } from "react"
import { useFormContext, useFormState } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Agent } from "@illa-public/public-types"
import BlackButton from "@/components/BlackButton"
import { IPreviewButtonProps } from "./interface"

const PreviewButton = memo((props: IPreviewButtonProps) => {
  const { onClickPreviewCallback } = props
  const { control } = useFormContext<Agent>()
  const { isSubmitting } = useFormState({ control })
  const { t } = useTranslation()

  return (
    <BlackButton
      id="save-button"
      onClick={onClickPreviewCallback}
      size="large"
      loading={isSubmitting}
      type="primary"
    >
      {t("editor.ai-agent.preview")}
    </BlackButton>
  )
})

PreviewButton.displayName = "PreviewButton"

export default PreviewButton
