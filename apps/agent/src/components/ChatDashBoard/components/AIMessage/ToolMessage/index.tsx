import Icon from "@ant-design/icons"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { DownIcon, UpIcon } from "@illa-public/icon"
import { MESSAGE_STATUS } from "@/components/ChatDashBoard/interface"
import LottieItem from "@/components/LottieItem"
import tipiRunLoading from "@/config/lottieConfig/tipiRunLoading.json"
import MarkdownMessage from "../../MarkdownMessage"
import { CODE_STATUS } from "../../MarkdownMessage/interface"
import MessageDivide from "../MessageDivide"
import { IToolMessageProps } from "./interface"
import {
  actionIconStyle,
  containerStyle,
  errorInfoLineStyle,
  headerContainerStyle,
  iconStyle,
  infoContainerStyle,
  infoDescStyle,
  infoTextContainerStyle,
  infoTitleStyle,
  inlineLineStyle,
  lottieLoadingStyle,
  messageContainerStyle,
  responseStyle,
  textAndIconContainerStyle,
} from "./style"
import { useGetInfoByStatus } from "./utils"

const ToolMessage: FC<IToolMessageProps> = ({
  content,
  functionName,
  status,
  message_result,
}) => {
  const { t } = useTranslation()
  const [showMessage, setShowMessage] = useState(false)

  const code = `\`\`\`python\n${content?.input.code}\n\`\`\``

  const getInfoByStatus = useGetInfoByStatus()

  const { infoDesc, InfoIcon, infoTitle } = getInfoByStatus(
    status,
    functionName,
  )

  return (
    <div css={containerStyle}>
      <div
        css={headerContainerStyle}
        onClick={() => setShowMessage(!showMessage)}
      >
        <div css={infoContainerStyle}>
          {status !== MESSAGE_STATUS.ANALYZE_PENDING ? (
            <>
              <div css={textAndIconContainerStyle}>
                <div css={iconStyle(status)}>{InfoIcon}</div>
                <div css={infoTextContainerStyle}>
                  <span css={infoTitleStyle}>{infoTitle}</span>
                  <span css={infoDescStyle(status)}>{infoDesc}</span>
                </div>
              </div>
              {code && (
                <Icon
                  component={showMessage ? UpIcon : DownIcon}
                  css={actionIconStyle}
                />
              )}
            </>
          ) : (
            <div css={lottieLoadingStyle}>
              <LottieItem configJson={tipiRunLoading} autoplay loop />
            </div>
          )}
        </div>
      </div>
      {!!(code && showMessage) && (
        <>
          <MessageDivide />
          <div css={messageContainerStyle}>
            <MarkdownMessage>{code}</MarkdownMessage>
            {message_result && (
              <>
                <div css={errorInfoLineStyle}>
                  <div css={inlineLineStyle} />
                </div>
                <span css={responseStyle}>
                  {t("homepage.tipi_chat.response.resonse")}
                </span>
                <MarkdownMessage codeStatus={CODE_STATUS.ERROR}>
                  {message_result}
                </MarkdownMessage>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ToolMessage
