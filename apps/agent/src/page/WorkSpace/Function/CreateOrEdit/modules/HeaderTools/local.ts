import { useTranslation } from "react-i18next"

const useTempLocal = () => {
  const { t } = useTranslation()

  t("function.edit.variable_modal.error.test_value")

  t("function.edit.test.result.response")
  t("function.edit.test.result.status")
  t("function.edit.test.result.time")
  t("function.edit.test.result.success")
  t("function.edit.test.result.failed")
}
