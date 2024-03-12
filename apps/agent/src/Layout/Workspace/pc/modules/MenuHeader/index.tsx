import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { PreviousDoubleIcon } from "@illa-public/icon"
import LogoIcon from "@/assets/public/logo.svg?react"
import {
  logoAndProjectNameContainerStyle,
  menuHeaderStyle,
  projectNameStyle,
} from "./style"

const MenuHeader: FC = () => {
  return (
    <div css={menuHeaderStyle}>
      <div css={logoAndProjectNameContainerStyle}>
        <Icon component={LogoIcon} />
        <span css={projectNameStyle}>tipis.AI</span>
      </div>
      <Button icon={<Icon component={PreviousDoubleIcon} />} type="text" />
    </div>
  )
}

export default MenuHeader
