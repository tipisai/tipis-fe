import { FC } from "react"
import { lineContainerStyle, lineStyle } from "./style"

const MessageDivide: FC = () => {
  return (
    <div css={lineContainerStyle}>
      <div css={lineStyle} />
    </div>
  )
}

export default MessageDivide
