import { FC } from "react"
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

  return (
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.PASSWORD_SETTING}
    >
      {userInfo.isPasswordSet ? <ChangePassword /> : <FirstSetPassword />}
    </MixpanelTrackProvider>
  )
}

export default PasswordSettingPage
