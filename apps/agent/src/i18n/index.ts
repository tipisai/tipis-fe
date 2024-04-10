import i18n from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import HttpApi, { HttpBackendOptions } from "i18next-http-backend"
import { initReactI18next } from "react-i18next"
import { languageKeys } from "@illa-public/utils"

export const defaultLanguage = "en-US"

const initClientI18n = async () => {
  const resources: Record<string, any> = {}

  for (const lng of languageKeys) {
    const resource = await import(`../locales/${lng}.json`)
    resources[lng] = {
      translation: resource.default,
    }
  }

  return i18n
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
      lng: "en-US",
      load: "all",
      fallbackLng: defaultLanguage,
      supportedLngs: languageKeys,
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
      resources,
    })
}

const initBrowserI18n = async () => {
  return i18n
    .use(HttpApi)
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      load: "all",
      backend: {
        loadPath: `/locales/{{lng}}.json`,
      },
      // fallbackLng: (code) => {
      //   const language = formatLanguage(code)
      //   return [language, "en-US"]
      // },
      fallbackLng: defaultLanguage,
      supportedLngs: languageKeys,
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
    })
}

export const initI18n =
  import.meta.env.ILLA_USE_IN_CLIENT === "1" ? initClientI18n : initBrowserI18n

export default i18n
