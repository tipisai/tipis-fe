import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import PCClearButton from "../ClearButton/pc"
import PCMemoryButton from "../MemoryButton/pc"
import { buttonContainerStyle, headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  return (
    <div css={headerToolsContainerStyle}>
      <LayoutAutoChange
        desktopPage={
          <div css={buttonContainerStyle}>
            <PCClearButton />
            <PCMemoryButton />
          </div>
        }
      />
    </div>
  )
}

export default HeaderTools
