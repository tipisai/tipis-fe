import Icon from "@ant-design/icons"
import { FC } from "react"
import { WarningCircleIcon } from "@illa-public/icon"
import { errorIconStyle, errorMsgStyle } from "./style"

interface ErrorMessageProps {
  message: string | undefined
}

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div css={errorMsgStyle}>
      <Icon component={WarningCircleIcon} css={errorIconStyle} />
      {message ?? ""}
    </div>
  )
}

export default ErrorMessage
