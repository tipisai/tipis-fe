import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useAuthBySocialMutation } from "@illa-public/user-data"
import GoogleIcon from "@/assets/public/googleIcon.svg?react"
import { authButtonStyle } from "./style"

const GoogleAuthButton: FC = () => {
  const { t } = useTranslation()
  const [authBySocial] = useAuthBySocialMutation()
  const { message } = App.useApp()
  const handleGoogleAuth = async () => {
    try {
      await authBySocial("google").unwrap()
    } catch (e) {
      message.error(t("page.user.new_auth.auth_failed"))
    }
  }
  return (
    <div css={authButtonStyle}>
      <Button
        block
        size="large"
        onClick={handleGoogleAuth}
        icon={<Icon component={GoogleIcon} />}
      >
        {t("page.user.new_auth.google")}
      </Button>
    </div>
  )
}

export default GoogleAuthButton
