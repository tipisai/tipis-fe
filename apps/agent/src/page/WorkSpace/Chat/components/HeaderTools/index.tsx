import { FC } from "react"
import StartButton from "../StartButton"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  return (
    <div css={headerToolsContainerStyle}>
      <StartButton />
    </div>
  )
}

export default HeaderTools
