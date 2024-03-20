import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { PreviousDoubleIcon } from "@illa-public/icon"
import LogoIcon from "@/assets/public/logo.svg?react"
import { MenuStatusUIContext } from "../Menu/context"
import {
  logoAndProjectNameContainerStyle,
  menuHeaderStyle,
  projectNameStyle,
} from "./style"

const MenuHeader: FC = () => {
  const { changeCollapsed } = useContext(MenuStatusUIContext)
  return (
    <div css={menuHeaderStyle}>
      <div css={logoAndProjectNameContainerStyle}>
        <Icon component={LogoIcon} />
        <span css={projectNameStyle}>tipis.AI</span>
      </div>
      <Button
        icon={<Icon component={PreviousDoubleIcon} />}
        type="text"
        onClick={() => {
          changeCollapsed(true)
        }}
      />
    </div>
  )
}

export default MenuHeader
