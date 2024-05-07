import Icon from "@ant-design/icons"
import { App, Tooltip } from "antd"
import { FC, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { CopyIcon, DownIcon, UpIcon } from "@illa-public/icon"
import { copyToClipboard } from "@illa-public/utils"
import LottieItem from "@/components/LottieItem"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import tipiRunLoading from "@/config/lottieConfig/tipiRunLoading.json"
import MarkdownMessage from "../MarkdownMessage"
import { CODE_STATUS } from "../MarkdownMessage/interface"
import { RUN_REQUEST_TYPE } from "./constants"
import { PureMessageProps, SyncMessageCardProps } from "./interface"
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

export const PureMessage: FC<PureMessageProps> = ({ message, isMobile }) => {
  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  const contentBody = (
    <div css={pureMessageContainerStyle} ref={containerRef}>
      <MarkdownMessage>{message}</MarkdownMessage>
    </div>
  )

  if (!message) return null
  return isMobile ? (
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
  disableTrigger,
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
  const { infoDesc, InfoIcon, InfoTitle } = getInfoByStatus(
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
            <MarkdownMessage disableTrigger={disableTrigger}>
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
                  disableTrigger={disableTrigger}
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
