import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"

const TestFunctionButton: FC = () => {
  const { t } = useTranslation()
  return (
    <Button size="large">
      {t("function.edit.test.button.test_connection")}
    </Button>
  )
}

export default TestFunctionButton
