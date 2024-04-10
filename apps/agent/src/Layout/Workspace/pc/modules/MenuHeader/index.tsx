import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useCallback, useContext } from "react"
import { TipisTrack } from "@illa-public/track-utils"
import TextAndLogo from "@/assets/public/textLogo.svg?react"
import MenuCollapseIcon from "@/assets/workspace/menuCollapse.svg?react"
import { MenuStatusUIContext } from "../Menu/context"
import { logoAndProjectNameContainerStyle, menuHeaderStyle } from "./style"

const MenuHeader: FC = () => {
  const { changeCollapsed } = useContext(MenuStatusUIContext)

  const onClickFoldButton = useCallback(() => {
    TipisTrack.track("click_collapse")

    changeCollapsed(true)
  }, [changeCollapsed])

  return (
    <div css={menuHeaderStyle}>
      <div css={logoAndProjectNameContainerStyle}>
        <TextAndLogo />
      </div>
      <div>
        <Button
          icon={<Icon component={MenuCollapseIcon} />}
          type="text"
          onClick={onClickFoldButton}
        />
      </div>
    </div>
  )
}

export default MenuHeader
