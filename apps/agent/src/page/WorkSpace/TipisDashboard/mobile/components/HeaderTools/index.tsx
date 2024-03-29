import Icon from "@ant-design/icons"
import { Button } from "antd"
import { t } from "i18next"
import { FC } from "react"
import { PlusIcon } from "@illa-public/icon"
import { useAddCreateTipisTab } from "@/utils/recentTabs/hook"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const createTipi = useAddCreateTipisTab()

  return (
    <div css={headerToolsContainerStyle}>
      <Button
        type="primary"
        icon={<Icon component={PlusIcon} />}
        size="large"
        onClick={createTipi}
      >
        {t("dashboard.create")}
      </Button>
    </div>
  )
}

export default HeaderTools
