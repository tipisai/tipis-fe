import Icon from "@ant-design/icons"
import { Button } from "antd"
import { t } from "i18next"
import { FC } from "react"
import { PlusIcon } from "@illa-public/icon"
import { useNavigateToCreateTipis } from "@/utils/routeHelper/hook"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const navigateToCreateTipis = useNavigateToCreateTipis()

  return (
    <div css={headerToolsContainerStyle}>
      <Button
        type="primary"
        icon={<Icon component={PlusIcon} />}
        size="large"
        onClick={navigateToCreateTipis}
      >
        {t("dashboard.create")}
      </Button>
    </div>
  )
}

export default HeaderTools
