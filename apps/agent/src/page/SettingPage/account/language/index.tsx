import { FC, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  getCurrentTranslateLanguage,
  useUpdateUserLanguageMutation,
} from "@illa-public/user-data"
import { defaultLanguage } from "@/i18n"
import { track } from "@/utils/mixpanelHelper"
import SettingMobileLayout from "../../layout/mobile"
import MobileLanguageSetting from "./mobile"
import PCLanguageSetting from "./pc"

const LanguageSetting: FC = () => {
  const language = useSelector(getCurrentTranslateLanguage) || defaultLanguage
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [languageLoading, setLanguageLoading] = useState(false)
  const { i18n } = useTranslation()

  const [updateUserLanguage] = useUpdateUserLanguageMutation()

  useEffect(() => {
    track(
      ILLA_MIXPANEL_EVENT_TYPE.VISIT,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.LANGUAGE_SETTING,
      {
        element: "language",
      },
    )
  }, [])

  const onSaveLanguageChange = async () => {
    try {
      setLanguageLoading(true)
      await updateUserLanguage(currentLanguage)
      await i18n.changeLanguage(currentLanguage)
    } catch (e) {
    } finally {
      setLanguageLoading(false)
    }
  }
  return (
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.LANGUAGE_SETTING}
    >
      <LayoutAutoChange
        desktopPage={
          <PCLanguageSetting
            loading={languageLoading}
            language={language}
            currentLanguage={currentLanguage}
            onChangeLanguage={setCurrentLanguage}
            onSubmit={onSaveLanguageChange}
          />
        }
        mobilePage={
          <SettingMobileLayout>
            <MobileLanguageSetting
              loading={languageLoading}
              language={language}
              currentLanguage={currentLanguage}
              onChangeLanguage={setCurrentLanguage}
              onSubmit={onSaveLanguageChange}
            />
          </SettingMobileLayout>
        }
      />
    </MixpanelTrackProvider>
  )
}
export default LanguageSetting
