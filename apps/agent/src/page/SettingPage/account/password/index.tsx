import { FC } from "react"
import { useSelector } from "react-redux"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { getCurrentUser } from "@illa-public/user-data"
import { track } from "@/utils/mixpanelHelper"
import SettingMobileLayout from "../../layout/mobile"
import ChangePassword from "./components/ChangePassword"
import FirstSetPassword from "./components/FirstSetPassword"

const PasswordSettingPage: FC = () => {
  const userInfo = useSelector(getCurrentUser)

  return (
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.PASSWORD_SETTING}
    >
      {userInfo.isPasswordSet ? (
        <LayoutAutoChange
          desktopPage={<ChangePassword />}
          mobilePage={
            <SettingMobileLayout>
              <ChangePassword />
            </SettingMobileLayout>
          }
        />
      ) : (
        <LayoutAutoChange
          desktopPage={<FirstSetPassword />}
          mobilePage={
            <SettingMobileLayout>
              <FirstSetPassword />
            </SettingMobileLayout>
          }
        />
      )}
    </MixpanelTrackProvider>
  )
}

export default PasswordSettingPage
