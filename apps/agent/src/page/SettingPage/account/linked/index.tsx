import { FC, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useBeforeUnload } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import MobileLinkedSetting from "./mobile"
import PCLinkedSetting from "./pc"

const LinkedSetting: FC = () => {
  const { t } = useTranslation()

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_LINKED)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_LINKED)
    }
  }, [])

  useBeforeUnload(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_LINKED)
  })

  return (
    <>
      <Helmet>
        <title>{t("profile.setting.oauth.title.oauth")}</title>
      </Helmet>
      <LayoutAutoChange
        desktopPage={<PCLinkedSetting />}
        mobilePage={<MobileLinkedSetting />}
      />
    </>
  )
}
export default LinkedSetting
