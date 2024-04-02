import { FC, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useBeforeUnload } from "react-router-dom"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import ChangePassword from "./components/ChangePassword"
import FirstSetPassword from "./components/FirstSetPassword"

const PasswordSettingPage: FC = () => {
  const { data: userInfo } = useGetUserInfoQuery(null)
  const { t } = useTranslation()

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_PASSWORD)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_PASSWORD)
    }
  }, [])

  useBeforeUnload(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_PASSWORD)
  })

  return (
    <>
      <Helmet>
        <title>{t("profile.setting.password.title")}</title>
      </Helmet>
      {userInfo?.isPasswordSet ? <ChangePassword /> : <FirstSetPassword />}
    </>
  )
}

export default PasswordSettingPage
