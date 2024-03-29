import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import TextAndLogo from "@/assets/public/textLogo.svg?react"
import MenuFoldIcon from "@/assets/workspace/menuFold.svg?react"
import { MenuStatusUIContext } from "../Menu/context"
import { logoAndProjectNameContainerStyle, menuHeaderStyle } from "./style"

const MenuHeader: FC = () => {
  const { changeCollapsed } = useContext(MenuStatusUIContext)
  return (
    <div css={menuHeaderStyle}>
      <div css={logoAndProjectNameContainerStyle}>
        <TextAndLogo />
      </div>
      <div>
        <Button
          icon={<Icon component={MenuFoldIcon} />}
          type="text"
          onClick={() => {
            changeCollapsed(true)
          }}
        />
      </div>
    </div>
  )
}

export default MenuHeader
