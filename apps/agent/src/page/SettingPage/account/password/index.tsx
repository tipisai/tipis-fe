import { FC } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { getCurrentUser } from "@illa-public/user-data"
import { track } from "@/utils/mixpanelHelper"
import ChangePassword from "./components/ChangePassword"
import FirstSetPassword from "./components/FirstSetPassword"

const PasswordSettingPage: FC = () => {
  const userInfo = useSelector(getCurrentUser)
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>{t("profile.setting.password.title")}</title>
      </Helmet>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.PASSWORD_SETTING}
      >
        {userInfo.isPasswordSet ? <ChangePassword /> : <FirstSetPassword />}
      </MixpanelTrackProvider>
    </>
  )
}

export default PasswordSettingPage
