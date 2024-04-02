import { FC, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useBeforeUnload } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import {
  useGetUserInfoQuery,
  useUpdateUserLanguageMutation,
} from "@illa-public/user-data"
import { defaultLanguage } from "@/i18n"
import MobileLanguageSetting from "./mobile"
import PCLanguageSetting from "./pc"

const LanguageSetting: FC = () => {
  const { data } = useGetUserInfoQuery(null)

  const language = data?.language || defaultLanguage

  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [languageLoading, setLanguageLoading] = useState(false)
  const { i18n, t } = useTranslation()

  const [updateUserLanguage] = useUpdateUserLanguageMutation()

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

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_LANGUAGE)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_LANGUAGE)
    }
  }, [])

  useBeforeUnload(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_LANGUAGE)
  })

  return (
    <>
      <Helmet>
        <title>{t("profile.setting.language")}</title>
      </Helmet>
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
          <MobileLanguageSetting
            loading={languageLoading}
            language={language}
            currentLanguage={currentLanguage}
            onChangeLanguage={setCurrentLanguage}
            onSubmit={onSaveLanguageChange}
          />
        }
      />
    </>
  )
}
export default LanguageSetting
