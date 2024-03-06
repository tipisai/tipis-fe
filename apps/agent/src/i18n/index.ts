import { formatLanguage } from "@illa-public/utils"
import i18n from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import HttpApi, { HttpBackendOptions } from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const defaultLanguage = "en-US"

export function getLocalLanguage(): string {
  const lang =
    window.localStorage.getItem("i18nextLng") || window.navigator.language
  return formatLanguage(lang)
}

i18n
  .use(HttpApi)
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    load: "currentOnly",
    backend: {
      loadPath: `${
        import.meta.env.ILLA_BASE_PATH
          ? `${import.meta.env.ILLA_BASE_PATH}`
          : ""
      }/locales/{{lng}}.json`,
    },
    // fallbackLng: (code) => {
    //   const language = formatLanguage(code)
    //   return [language, "en-US"]
    // },
    fallbackLng: defaultLanguage,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  })

export default i18n
