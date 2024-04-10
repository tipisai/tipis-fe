import Icon from "@ant-design/icons"
import { motion } from "framer-motion"
import { FC, useState } from "react"
import { DownIcon, UpIcon } from "@illa-public/icon"
import LottieItem from "@/components/LottieItem"
import { MESSAGE_STATUS } from "@/components/PreviewChat/interface"
import tipiRunLoading from "@/config/lottieConfig/tipiRunLoading.json"
import MarkdownMessage from "../MarkdownMessage"
import { RUN_REQUEST_TYPE } from "./constants"
import {
  PureMessageProps,
  SyncMessageCardProps,
  SyncMessageResultProps,
} from "./interface"
import {
  actionIconStyle,
  containerStyle,
  headerContainerStyle,
  iconStyle,
  infoContainerStyle,
  infoDescStyle,
  infoTextContainerStyle,
  infoTitleStyle,
  lineContainerStyle,
  lineStyle,
  lottieLoadingStyle,
  messageCardAnimation,
  messageContainerStyle,
  pureMessageContainerStyle,
  textAndIconContainerStyle,
} from "./style"
import { useGetInfoByStatus } from "./utils"

export const PureMessage: FC<PureMessageProps> = ({
  message,
  disableTrigger,
}) => {
  if (!message) return null
  return (
    <div css={pureMessageContainerStyle}>
      <MarkdownMessage disableTrigger={disableTrigger}>
        {message}
      </MarkdownMessage>
    </div>
  )
}

export const SyncMessageResult: FC<SyncMessageResultProps> = ({
  message,
  disableTrigger,
}) => {
  let formatMessage
  try {
    formatMessage = `\`\`\`json\n${JSON.stringify(JSON.parse(message) || {}, null, 2)}\n\`\`\``
  } catch (e) {
    formatMessage = `\`\`\`json\n${message}\n\`\`\``
  }
  return (
    <div css={pureMessageContainerStyle}>
      <MarkdownMessage disableTrigger={disableTrigger}>
        {formatMessage}
      </MarkdownMessage>
    </div>
  )
}

export const SyncMessageCard: FC<SyncMessageCardProps> = ({
  message,
  messageStatus,
  disableTrigger,
}) => {
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
      <motion.div
        variants={messageCardAnimation}
        animate={!!(formatMessage && showMessage) ? "enter" : "exit"}
        css={messageContainerStyle}
        transition={{ duration: 0.2 }}
        initial="exit"
        exit="exit"
      >
        <MarkdownMessage disableTrigger={disableTrigger}>
          {formatMessage}
        </MarkdownMessage>
      </motion.div>
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
