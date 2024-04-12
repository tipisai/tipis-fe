import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import MobileStartButton from "../StartButton/mobile"
import PCStartButton from "../StartButton/pc"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  return (
    <div css={headerToolsContainerStyle}>
      <LayoutAutoChange
        desktopPage={<PCStartButton />}
        mobilePage={<MobileStartButton />}
      />
    </div>
  )
}

export default HeaderTools
