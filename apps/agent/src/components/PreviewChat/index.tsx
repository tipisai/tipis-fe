import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import { SendIcon } from "@illa-public/icon"
import { IKnowledgeFile } from "@illa-public/public-types"
import { getCurrentUser } from "@illa-public/user-data"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal } from "@/api/ws/textSignal"
import AgentBlockInput from "@/assets/agent/agent-block-input.svg?react"
import StopIcon from "@/assets/agent/stop.svg?react"
import {
  MAX_FILE_SIZE,
  MAX_MESSAGE_FILES_LENGTH,
} from "@/config/constants/knowledge"
import AIAgentMessage from "@/page/WorkSpace/AI/components/AIAgentMessage"
import GroupAgentMessage from "@/page/WorkSpace/AI/components/GroupAgentMessage"
import UserMessage from "@/page/WorkSpace/AI/components/UserMessage"
import { isGroupMessage } from "@/utils/agent/typeHelper"
import { chatUploadStore, useUploadFileToDrive } from "@/utils/drive"
import { multipleFileHandler } from "@/utils/drive/utils"
import { SEND_MESSAGE_WS_TYPE } from "./TipisWebscoketContext/interface"
import UploadButton from "./UploadButton"
import UploadKnowledgeFiles from "./UploadKnowledgeFiles"
import {
  ChatMessage,
  ChatSendRequestPayload,
  PreviewChatProps,
  SenderType,
} from "./interface"
import {
  blockInputContainerStyle,
  blockInputTextStyle,
  chatContainerStyle,
  generatingContainerStyle,
  generatingContentContainerStyle,
  generatingDividerStyle,
  generatingTextStyle,
  inputContainerStyle,
  inputStyle,
  inputTextContainerStyle,
  mobileInputContainerStyle,
  mobileInputElementStyle,
  mobileInputStyle,
  operationStyle,
  previewChatContainerStyle,
  sendButtonStyle,
  stopIconStyle,
} from "./style"

export const PreviewChat: FC<PreviewChatProps> = (props) => {
  const { isMobile, blockInput, editState, onSendMessage, wsContextValue } =
    props

  const {
    wsStatus,
    isRunning,
    chatMessages,
    isReceiving,
    sendMessage,
    setIsReceiving,
  } = wsContextValue

  const onCancelReceiving = useCallback(() => {
    sendMessage(
      {} as ChatSendRequestPayload,
      TextSignal.STOP_ALL,
      SEND_MESSAGE_WS_TYPE.STOP_ALL,
    )
    setIsReceiving(false)
  }, [sendMessage, setIsReceiving])

  const currentUserInfo = useSelector(getCurrentUser)
  const { message: messageAPI } = App.useApp()

  const chatRef = useRef<HTMLDivElement>(null)

  const [textAreaVal, setTextAreaVal] = useState("")
  const [knowledgeFiles, setKnowledgeFiles] = useState<IKnowledgeFile[]>([])
  const [uploadKnowledgeLoading, setUploadKnowledgeLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const disableSend = isReceiving || blockInput || uploadKnowledgeLoading

  const { uploadChatFile } = useUploadFileToDrive()

  const { t } = useTranslation()

  const messagesList = useMemo(() => {
    return chatMessages.map((message, i) => {
      if (isGroupMessage(message)) {
        return (
          <GroupAgentMessage
            key={message.threadID}
            message={message}
            isMobile={isMobile}
            isLastMessage={i === chatMessages.length - 1}
            isReceiving={isReceiving}
          />
        )
      } else if (
        message.sender.senderType === SenderType.USER &&
        message.sender.senderID === currentUserInfo.userID
      ) {
        return (
          <UserMessage
            key={message.threadID}
            message={message}
            isMobile={isMobile}
          />
        )
      } else {
        return (
          <AIAgentMessage
            key={message.threadID}
            message={message}
            isMobile={isMobile}
            isLastMessage={i === chatMessages.length - 1}
            isReceiving={isReceiving}
          />
        )
      }
    })
  }, [chatMessages, currentUserInfo.userID, isMobile, isReceiving])

  const handleDeleteFile = (fileName: string, queryID?: string) => {
    const files = knowledgeFiles.filter((file) => file.fileName !== fileName)
    setKnowledgeFiles(files)
    queryID && chatUploadStore.deleteFileDetailInfo(queryID)
  }

  const handleClickUploadFile = () => {
    if (knowledgeFiles.length >= MAX_MESSAGE_FILES_LENGTH) {
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return
    }
    inputRef.current?.click()
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let inputFiles = Array.from(e.target.files || [])
    inputRef.current && (inputRef.current.value = "")
    if (!inputFiles.length) return
    if (inputFiles.length + knowledgeFiles.length > MAX_MESSAGE_FILES_LENGTH) {
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return
    }
    setUploadKnowledgeLoading(true)
    const currentFiles = [...knowledgeFiles]

    const formatFiles = multipleFileHandler(
      inputFiles,
      currentFiles,
      chatUploadStore,
    )
    currentFiles.push(
      ...formatFiles.map((item) => ({
        fileName: item.fileName,
        contentType: item.file.type,
        fileID: "",
      })),
    )
    setKnowledgeFiles(currentFiles)
    try {
      for (let item of formatFiles) {
        const { fileName, file, abortController } = item
        if (!file) break
        if (file.size > MAX_FILE_SIZE) {
          messageAPI.warning({
            content: t("dashboard.message.please_use_a_file_wi"),
          })
          setKnowledgeFiles(knowledgeFiles)
          chatUploadStore.mulDeleteFileDetailInfo(
            formatFiles.map((item) => item.queryID),
          )
          return
        }
        const fileID = await uploadChatFile(
          item.queryID,
          file,
          abortController.signal,
          chatUploadStore,
        )

        if (!!fileID) {
          const res = {
            fileName: fileName,
            contentType: file.type,
            fileID,
          }
          setKnowledgeFiles((prev) => {
            const currentItems = [...prev]
            const index = currentItems.findIndex(
              (item) => item.fileName === fileName,
            )
            currentItems.splice(index, 1, res)
            return currentItems
          })
        }
      }
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.bad_file"),
      })
    } finally {
      setUploadKnowledgeLoading(false)
    }
  }

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
    })
  }, [chatMessages])

  const sendAndClearMessage = useCallback(() => {
    const realSendKnowledgeFiles = knowledgeFiles.filter(
      (item) => !!item.fileID,
    )
    if (
      (textAreaVal !== "" && realSendKnowledgeFiles.length > 0) ||
      (textAreaVal !== "" && realSendKnowledgeFiles.length === 0)
    ) {
      onSendMessage({
        threadID: v4(),
        message: textAreaVal,
        sender: {
          senderID: currentUserInfo.userID,
          senderType: SenderType.USER,
        },
        knowledgeFiles: realSendKnowledgeFiles,
      } as ChatMessage)
      setTextAreaVal("")
      setKnowledgeFiles([])
      chatUploadStore.clearStore()
    }
  }, [currentUserInfo.userID, knowledgeFiles, onSendMessage, textAreaVal])

  return (
    <div css={previewChatContainerStyle}>
      <div ref={chatRef} css={chatContainerStyle}>
        {messagesList}
      </div>
      <div css={inputTextContainerStyle}>
        <AnimatePresence>
          {isReceiving &&
            wsStatus !== ILLA_WEBSOCKET_STATUS.CLOSED &&
            wsStatus !== ILLA_WEBSOCKET_STATUS.FAILED && (
              <motion.div
                css={generatingContainerStyle}
                initial={{
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  y: -16,
                  opacity: 1,
                }}
                exit={{
                  y: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <div css={generatingContentContainerStyle}>
                  <div css={generatingTextStyle}>
                    {t("editor.ai-agent.button.generating")}
                  </div>
                  <div css={generatingDividerStyle} />
                  <StopIcon
                    css={stopIconStyle}
                    onClick={() => {
                      onCancelReceiving()
                    }}
                  />
                </div>
              </motion.div>
            )}
          {isRunning &&
            (wsStatus === ILLA_WEBSOCKET_STATUS.CLOSED ||
              wsStatus === ILLA_WEBSOCKET_STATUS.FAILED) && (
              <motion.div
                css={generatingContainerStyle}
                initial={{
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  y: -16,
                  opacity: 1,
                }}
                exit={{
                  y: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <div css={generatingContentContainerStyle}>
                  <div css={generatingTextStyle}>
                    {t("editor.ai-agent.message.reconnect")}
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
        {blockInput ? (
          <div css={blockInputContainerStyle}>
            <AgentBlockInput />
            <div css={blockInputTextStyle}>
              {editState === "RUN"
                ? t("editor.ai-agent.tips.not-start-run")
                : t("editor.ai-agent.tips.not-start")}
            </div>
          </div>
        ) : isMobile ? (
          <div css={mobileInputContainerStyle}>
            <div css={mobileInputStyle}>
              <input
                css={mobileInputElementStyle}
                value={textAreaVal}
                placeholder={t("editor.ai-agent.placeholder.send")}
                onKeyDown={(event) => {
                  if (event.keyCode === 13 && !event.shiftKey) {
                    event.preventDefault()
                    if (disableSend) {
                      return
                    }
                    sendAndClearMessage()
                  }
                }}
                onChange={(v) => {
                  setTextAreaVal(v.target.value)
                }}
              />
              <UploadButton
                handleClick={handleClickUploadFile}
                handleFileChange={handleFileChange}
                ref={inputRef}
              />
              <Button
                type="primary"
                size="large"
                icon={<Icon component={SendIcon} />}
                disabled={disableSend}
                onClick={sendAndClearMessage}
              >
                {t("editor.ai-agent.button.send")}
              </Button>
            </div>
            <UploadKnowledgeFiles
              knowledgeFiles={knowledgeFiles}
              handleDeleteFile={handleDeleteFile}
              chatUploadStore={chatUploadStore}
            />
          </div>
        ) : (
          <div css={inputContainerStyle}>
            <textarea
              value={textAreaVal}
              css={inputStyle}
              placeholder={t("editor.ai-agent.placeholder.send")}
              onKeyDown={(event) => {
                if (event.keyCode === 13 && !event.shiftKey) {
                  event.preventDefault()
                  if (disableSend) {
                    return
                  }
                  sendAndClearMessage()
                }
              }}
              onChange={(event) => {
                setTextAreaVal(event.target.value)
              }}
            />
            <div css={operationStyle}>
              <UploadKnowledgeFiles
                knowledgeFiles={knowledgeFiles}
                handleDeleteFile={handleDeleteFile}
                chatUploadStore={chatUploadStore}
              />
              <div css={sendButtonStyle}>
                <UploadButton
                  handleClick={handleClickUploadFile}
                  handleFileChange={handleFileChange}
                  ref={inputRef}
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<Icon component={SendIcon} />}
                  disabled={disableSend}
                  onClick={sendAndClearMessage}
                >
                  {t("editor.ai-agent.button.send")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
