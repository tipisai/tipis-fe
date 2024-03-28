import Icon from "@ant-design/icons"
import { Button, Image } from "antd"
import { FC, useContext } from "react"
import TextAndLogoSrc from "@/assets/public/textLogo.png"
import MenuFoldIcon from "@/assets/workspace/menuFold.svg?react"
import { MenuStatusUIContext } from "../Menu/context"
import { logoAndProjectNameContainerStyle, menuHeaderStyle } from "./style"

const MenuHeader: FC = () => {
  const { changeCollapsed } = useContext(MenuStatusUIContext)
  return (
    <div css={menuHeaderStyle}>
      <div css={logoAndProjectNameContainerStyle}>
        <Image src={TextAndLogoSrc} preview={false} />
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
