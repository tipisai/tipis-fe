import { FC } from "react"
import { errorMsgStyle } from "./style"

interface ErrorTextProps {
  message: string | undefined
}

export const TipText: FC<ErrorTextProps> = ({ message }) => {
  if (!message) return null
  return <div css={errorMsgStyle}>{message}</div>
}
