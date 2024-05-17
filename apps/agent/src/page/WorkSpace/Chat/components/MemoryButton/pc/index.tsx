import Icon from "@ant-design/icons"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { MemoryIcon } from "@illa-public/icon"
import BlackButton from "@/components/BlackButton"

const PCMemoryButton: FC = () => {
  const { t } = useTranslation()

  return (
    <BlackButton
      size="large"
      htmlType="submit"
      type="primary"
      icon={<Icon component={MemoryIcon} />}
    >
      {t("_memory")}
    </BlackButton>
  )
}

export default PCMemoryButton
