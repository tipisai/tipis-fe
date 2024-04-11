import Icon from "@ant-design/icons"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { DownIcon, UpIcon } from "@illa-public/icon"
import LottieItem from "@/components/LottieItem"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import tipiRunLoading from "@/config/lottieConfig/tipiRunLoading.json"
import MarkdownMessage from "../MarkdownMessage"
import { CODE_STATUS } from "../MarkdownMessage/interface"
import { RUN_REQUEST_TYPE } from "./constants"
import {
  PureMessageProps,
  SyncMessageCardProps,
  SyncMessageResultProps,
} from "./interface"
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
  lineContainerStyle,
  lineStyle,
  lottieLoadingStyle,
  messageContainerStyle,
  pureMessageContainerStyle,
  responseStyle,
  textAndIconContainerStyle,
} from "./style"
import { useGetInfoByStatus } from "./utils"

export const PureMessage: FC<PureMessageProps> = ({
  message,
  disableTrigger,
  isReceiving,
}) => {
  if (!message) return null
  return (
    <div css={pureMessageContainerStyle}>
      <MarkdownMessage
        isReceiving={isReceiving}
        disableTrigger={disableTrigger}
      >
        {message}
      </MarkdownMessage>
    </div>
  )
}

export const SyncMessageResult: FC<SyncMessageResultProps> = ({
  message,
  disableTrigger,
  isReceiving,
}) => {
  let formatMessage
  try {
    formatMessage = `\`\`\`json\n${JSON.stringify(JSON.parse(message) || {}, null, 2)}\n\`\`\``
  } catch (e) {
    formatMessage = `\`\`\`json\n${message}\n\`\`\``
  }
  return (
    <div css={pureMessageContainerStyle}>
      <MarkdownMessage
        isReceiving={isReceiving}
        disableTrigger={disableTrigger}
      >
        {formatMessage}
      </MarkdownMessage>
    </div>
  )
}

export const SyncMessageCard: FC<SyncMessageCardProps> = ({
  message,
  messageStatus,
  messageResult,
  isReceiving,
}) => {
  const { t } = useTranslation()
  const [showMessage, setShowMessage] = useState(false)
  let formatMessage, runRequestType: RUN_REQUEST_TYPE | undefined
  try {
    const res = JSON.parse(message)
    const functionName = res?.["function_name"]
    const code = res?.["function_arguments"]?.["code"]
    if (code) {
      formatMessage = `\`\`\`python\n${code}\n\`\`\``
    }
    if (functionName) {
      runRequestType = functionName
    }
  } catch (e) {}

  let errorInfo
  try {
    if (messageResult) {
      errorInfo = `\`\`\`json\n${JSON.stringify(JSON.parse(messageResult) || {}, null, 2)}\n\`\`\``
    }
  } catch (e) {}

  const getInfoByStatus = useGetInfoByStatus()

  const { InfoIcon, InfoTitle, infoDesc } = getInfoByStatus(
    messageStatus,
    runRequestType,
  )

  return (
    <div css={containerStyle}>
      <div
        css={headerContainerStyle}
        onClick={() => setShowMessage(!showMessage)}
      >
        <div css={infoContainerStyle}>
          {runRequestType ||
          messageStatus !== MESSAGE_STATUS.ANALYZE_PENDING ? (
            <>
              <div css={textAndIconContainerStyle}>
                <div css={iconStyle(messageStatus)}>{InfoIcon}</div>
                <div css={infoTextContainerStyle}>
                  <span css={infoTitleStyle}>{InfoTitle}</span>
                  <span css={infoDescStyle(messageStatus)}>{infoDesc}</span>
                </div>
              </div>
              {formatMessage && (
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
      {!!(formatMessage && showMessage) && (
        <>
          <SyncMessageLine />
          <div css={messageContainerStyle}>
            <MarkdownMessage isReceiving={isReceiving} disableTrigger={true}>
              {formatMessage}
            </MarkdownMessage>
            {errorInfo && (
              <>
                <div css={errorInfoLineStyle}>
                  <div css={inlineLineStyle} />
                </div>
                <span css={responseStyle}>
                  {t("homepage.tipi_chat.response.resonse")}
                </span>
                <MarkdownMessage
                  isReceiving={isReceiving}
                  disableTrigger={true}
                  codeStatus={CODE_STATUS.ERROR}
                >
                  {errorInfo}
                </MarkdownMessage>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export const SyncMessageLine = () => {
  return (
    <div css={lineContainerStyle}>
      <div css={lineStyle} />
    </div>
  )
}
