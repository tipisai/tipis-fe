import { FC } from "react"
import { useTranslation } from "react-i18next"
import BlackButton from "@/components/BlackButton"
import { publishButtonStyle } from "./style"

const PublishButton: FC = () => {
  const { t } = useTranslation()
  return (
    <BlackButton
      type="primary"
      htmlType="submit"
      size="large"
      css={publishButtonStyle}
    >
      {t("function.edit.save.button.save")}
    </BlackButton>
  )
}

export default PublishButton
