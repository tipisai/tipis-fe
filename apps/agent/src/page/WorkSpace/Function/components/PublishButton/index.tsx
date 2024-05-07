import { memo } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import BlackButton from "@/components/BlackButton"
import { publishButtonStyle } from "./style"

const PublishButton = memo(() => {
  const { t } = useTranslation()

  const { formState } = useFormContext()

  return (
    <BlackButton
      type="primary"
      htmlType="submit"
      size="large"
      css={publishButtonStyle}
      loading={formState.isSubmitting}
    >
      {t("function.edit.save.button.save")}
    </BlackButton>
  )
})

PublishButton.displayName = "PublishButton"

export default PublishButton
