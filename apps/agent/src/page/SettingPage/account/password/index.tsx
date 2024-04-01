import { FC } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import ChangePassword from "./components/ChangePassword"
import FirstSetPassword from "./components/FirstSetPassword"

const PasswordSettingPage: FC = () => {
  const { data: userInfo } = useGetUserInfoQuery(null)
  const { t } = useTranslation()

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
