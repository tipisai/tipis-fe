import { FC } from "react"
import { ITextAlertProps } from "./interface"
import { textAlertContainerStyle, textAlertContentStyle } from "./style"

const TextAlert: FC<ITextAlertProps> = (props) => {
  return (
    <div css={textAlertContainerStyle}>
      <p css={textAlertContentStyle}>{props.content}</p>
    </div>
  )
}

export default TextAlert
