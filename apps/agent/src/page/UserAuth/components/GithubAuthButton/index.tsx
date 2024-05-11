import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useAuthBySocialMutation } from "@illa-public/user-data"
import GithubIcon from "@/assets/public/github.svg?react"
import { authButtonStyle } from "./style"

const GithubAuthButton: FC = () => {
  const { t } = useTranslation()
  const [authBySocial] = useAuthBySocialMutation()
  const { message } = App.useApp()
  const handleGithubAuth = async () => {
    try {
      await authBySocial("github").unwrap()
    } catch (e) {
      message.error(t("page.user.new_auth.auth_failed"))
    }
  }
  return (
    <div css={authButtonStyle}>
      <Button
        block
        size="large"
        onClick={handleGithubAuth}
        icon={<Icon component={GithubIcon} />}
      >
        {t("page.user.new_auth.github")}
      </Button>
    </div>
  )
}

export default GithubAuthButton
