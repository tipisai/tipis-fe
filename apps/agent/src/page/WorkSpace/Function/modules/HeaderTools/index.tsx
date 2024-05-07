import { FC } from "react"
import PublishButton from "../../components/PublishButton"
import TestFunctionButton from "../../components/TestFunctionButton"
import { headerToolsContainerStyle } from "./style"

const HeaderTools: FC = () => {
  return (
    <div css={headerToolsContainerStyle}>
      <TestFunctionButton />
      <PublishButton />
    </div>
  )
}

export default HeaderTools
