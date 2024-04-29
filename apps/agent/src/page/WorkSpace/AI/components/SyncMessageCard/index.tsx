import Icon from "@ant-design/icons"
import { App, Tooltip } from "antd"
import { FC, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon, DownIcon, UpIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import LottieItem from "@/components/LottieItem"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import tipiRunLoading from "@/config/lottieConfig/tipiRunLoading.json"
import MarkdownMessage from "../MarkdownMessage"
import { CODE_STATUS } from "../MarkdownMessage/interface"
import { RUN_REQUEST_TYPE } from "./constants"
import {
  IMessageCardShowInfo,
  PureMessageProps,
  SyncMessageCardProps,
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
  markdownHoverCopyStyle,
  messageContainerStyle,
  pureMessageContainerStyle,
  responseStyle,
  textAndIconContainerStyle,
} from "./style"
import { useGetInfoByStatus } from "./utils"

export const PureMessage: FC<PureMessageProps> = ({
  message,
  disableTrigger,
  isMobile,
}) => {
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const contentBody = (
    <div css={pureMessageContainerStyle} ref={containerRef}>
      <MarkdownMessage isReceiving={false}>{message}</MarkdownMessage>
    </div>
  )

  if (!message) return null
  return isMobile || disableTrigger ? (
    contentBody
  ) : (
    <Tooltip
      color="transparent"
      zIndex={0}
      overlayInnerStyle={{
        padding: 0,
        minHeight: "24px",
        minWidth: "24px",
        boxShadow: "none",
      }}
      mouseEnterDelay={0}
      mouseLeaveDelay={0.5}
      title={
        <span
          css={markdownHoverCopyStyle}
          onClick={() => {
            copyToClipboard(message ?? "")
            messageAPI.success({
              content: t("copied"),
            })
          }}
        >
          <Icon component={CopyIcon} />
        </span>
      }
      placement="rightBottom"
      showArrow={false}
      autoAdjustOverflow={false}
      trigger="hover"
      getTooltipContainer={() => containerRef.current!}
    >
      {contentBody}
    </Tooltip>
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
  const [showMessageInfo, setShowMessageInfo] =
    useState<IMessageCardShowInfo | null>()
  let formatMessage,
    runRequestType: RUN_REQUEST_TYPE | undefined,
    toolCallID: string = ""
  try {
    const res = JSON.parse(message)
    const functionName = res?.["function_name"]
    const code = res?.["function_arguments"]?.["code"]
    toolCallID = res?.["tool_call_id"]
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

  useEffect(() => {
    getInfoByStatus(messageStatus, runRequestType, toolCallID).then((info) => {
      setShowMessageInfo(info)
    })
  }, [getInfoByStatus, messageStatus, runRequestType, toolCallID])

  return (
    <div css={containerStyle}>
      <div
        css={headerContainerStyle}
        onClick={() => setShowMessage(!showMessage)}
      >
        <div css={infoContainerStyle}>
          {showMessageInfo &&
          (runRequestType ||
            messageStatus !== MESSAGE_STATUS.ANALYZE_PENDING) ? (
            <>
              <div css={textAndIconContainerStyle}>
                <div css={iconStyle(messageStatus)}>
                  {showMessageInfo.InfoIcon}
                </div>
                <div css={infoTextContainerStyle}>
                  <span css={infoTitleStyle}>{showMessageInfo.InfoTitle}</span>
                  <span css={infoDescStyle(messageStatus)}>
                    {showMessageInfo.infoDesc}
                  </span>
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
            <MarkdownMessage isReceiving={isReceiving}>
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
