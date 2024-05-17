import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { ClearIcon } from "@illa-public/icon"
import BlackButton from "@/components/BlackButton"

const PCClearButton: FC = () => {
  const { t } = useTranslation()

  return (
    <BlackButton
      size="large"
      htmlType="submit"
      type="primary"
      icon={<Icon component={ClearIcon} />}
    >
      {t("homepage.tipi_chat.clear_all")}
    </BlackButton>
  )
}

export default PCClearButton
