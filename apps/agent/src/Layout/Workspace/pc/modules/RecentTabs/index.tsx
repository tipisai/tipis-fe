import Icon from "@ant-design/icons"
import { FC } from "react"
import { PenIcon } from "@illa-public/icon"
import MenuItemButton from "../../components/MenuItemButton"
import { recentTabsContainerStyle } from "./style"

const RecentTabs: FC = () => {
  return (
    <div css={recentTabsContainerStyle}>
      <MenuItemButton text="Default Chat" icon={<Icon component={PenIcon} />} />
      <MenuItemButton
        text="Default Chat2"
        icon={<Icon component={PenIcon} />}
      />
      <MenuItemButton
        text="Default Chat3"
        icon={<Icon component={PenIcon} />}
      />
      <MenuItemButton
        text="Default Chat4"
        icon={<Icon component={PenIcon} />}
      />
    </div>
  )
}

export default RecentTabs
