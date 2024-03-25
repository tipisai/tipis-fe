import { useTranslation } from "react-i18next"

export const useLangOptions = () => {
  const { t } = useTranslation()

  return [
    {
      label: t("language.en-US"),
      value: "en-US",
    },
    {
      label: t("language.zh-CN"),
      value: "zh-CN",
    },
    {
      label: t("language.ja-JP"),
      value: "ja-JP",
    },
    {
      label: t("language.de-DE"),
      value: "de-DE",
    },
    {
      label: t("language.zh-TW"),
      value: "zh-TW",
    },
  ]
}
