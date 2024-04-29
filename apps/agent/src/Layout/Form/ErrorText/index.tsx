import Icon from "@ant-design/icons"
import { FC } from "react"
import { WarningCircleIcon } from "@illa-public/icon"
import { errorMsgStyle } from "./style"

interface ErrorTextProps {
  message: string | null | undefined
}

export const ErrorText: FC<ErrorTextProps> = ({ message }) => {
  if (!message) return null
  return (
    <div css={errorMsgStyle}>
      <Icon component={WarningCircleIcon} size={16} />
      {message}
    </div>
  )
}
