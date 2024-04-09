import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { ExitIcon } from "@illa-public/icon"
import { useLogout } from "@/page/SettingPage/hooks/useLogout"

const Logout: FC = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const logout = useLogout()

  return (
    <Button
      size="large"
      icon={<Icon component={ExitIcon} />}
      loading={isLoading}
      onClick={() => {
        setIsLoading(true)
        logout()
      }}
    >
      {t("profile.setting.logout")}
    </Button>
  )
}

export default Logout
