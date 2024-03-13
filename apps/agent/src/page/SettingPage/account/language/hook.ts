import { useTranslation } from "react-i18next"
import { languageKeys } from "@illa-public/utils"

export const useLangOptions = () => {
  const { t } = useTranslation()

  return languageKeys.map((key) => ({
    label: t(`language.${key}`),
    value: key,
  }))
}
