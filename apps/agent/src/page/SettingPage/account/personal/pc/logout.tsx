import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { getTeamItems } from "@illa-public/user-data"
import { useLogout } from "@/page/SettingPage/hooks/useLogout"
import { track } from "@/utils/mixpanelHelper"

const Logout: FC = () => {
  const { t } = useTranslation()
  const teams = useSelector(getTeamItems)
  const [isLoading, setIsLoading] = useState(false)
  const logout = useLogout()

  return (
    <Button
      type="primary"
      danger
      size="large"
      loading={isLoading}
      onClick={() => {
        track(
          ILLA_MIXPANEL_EVENT_TYPE.CLICK,
          ILLA_MIXPANEL_CLOUD_PAGE_NAME.ACCOUNT_SETTING,
          { element: "log_out", parameter3: teams?.length },
        )
        setIsLoading(true)
        logout()
      }}
    >
      {t("profile.setting.logout")}
    </Button>
  )
}

export default Logout
