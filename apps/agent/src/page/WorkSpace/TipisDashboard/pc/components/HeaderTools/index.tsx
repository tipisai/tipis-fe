import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { t } from "i18next"
import { FC } from "react"
import { PlusIcon, SearchIcon } from "@illa-public/icon"
import { useCreateTipis } from "@/utils/recentTabs/hook"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  const createTipi = useCreateTipis()

  return (
    <div css={headerToolsContainerStyle}>
      <Input
        placeholder="Search"
        prefix={<Icon component={SearchIcon} />}
        size="large"
      />
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
