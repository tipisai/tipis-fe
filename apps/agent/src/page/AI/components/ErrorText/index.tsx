import Icon from "@ant-design/icons"
import { WarningCircleIcon } from "@illa-public/icon"
import { FC } from "react"
import { errorMsgStyle } from "./style"

interface ErrorTextProps {
  errorMessage: string
}

export const ErrorText: FC<ErrorTextProps> = ({ errorMessage }) => {
  if (!errorMessage) return null
  return (
    <div css={errorMsgStyle}>
      <Icon component={WarningCircleIcon} size={16} />
      {errorMessage}
    </div>
  )
}
