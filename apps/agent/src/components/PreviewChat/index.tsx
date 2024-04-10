import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { SendIcon } from "@illa-public/icon"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import { IKnowledgeFile } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { useGetUserInfoQuery } from "@illa-public/user-data"
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
import { UploadFileStore, useUploadFileToDrive } from "@/utils/drive"
import { multipleFileHandler } from "@/utils/drive/utils"
import { PreviewChatUseContext } from "./PreviewChatUseContext"
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

  const { useTo } = useContext(PreviewChatUseContext)

  const chatUploadStoreRef = useRef(new UploadFileStore())

  const {
    getReadyState,
    isRunning,
    chatMessages,
    isReceiving,
    sendMessage,
    setIsReceiving,
  } = wsContextValue

  const onCancelReceiving = useCallback(() => {
    sendMessage(
      {} as ChatSendRequestPayload,
      TextSignal.STOP_RUN,
      SEND_MESSAGE_WS_TYPE.STOP_ALL,
    )
    setIsReceiving(false)
  }, [sendMessage, setIsReceiving])

  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const { message: messageAPI } = App.useApp()

  const chatRef = useRef<HTMLDivElement>(null)

  const [textAreaVal, setTextAreaVal] = useState("")
  const [knowledgeFiles, setKnowledgeFiles] = useState<IKnowledgeFile[]>([])
  const [uploadKnowledgeLoading, setUploadKnowledgeLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const disableSend =
    isReceiving || uploadKnowledgeLoading || textAreaVal === ""

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
        message.sender.senderID === currentUserInfo?.userID
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
  }, [chatMessages, currentUserInfo?.userID, isMobile, isReceiving])

  const handleDeleteFile = (fileName: string, queryID?: string) => {
    TipisTrack.track("chat_file_delete", {
      parameter1: useTo,
    })
    const files = knowledgeFiles.filter((file) => file.fileName !== fileName)
    setKnowledgeFiles(files)
    queryID && chatUploadStoreRef.current.deleteFileDetailInfo(queryID)
  }

  const handleClickUploadFile = () => {
    TipisTrack.track("click_upload_chat_file_entry", {
      parameter1: useTo,
    })
    if (knowledgeFiles.length >= MAX_MESSAGE_FILES_LENGTH) {
      TipisTrack.track("chat_file_over_num", {
        parameter1: useTo,
        parameter3: knowledgeFiles.length,
      })
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
      TipisTrack.track("chat_file_over_num", {
        parameter1: useTo,
        parameter3: inputFiles.length + knowledgeFiles.length,
      })
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return
    }
    TipisTrack.track("start_upload_chat_file", {
      parameter1: useTo,
    })
    setUploadKnowledgeLoading(true)
    const currentFiles = [...knowledgeFiles]

    const formatFiles = multipleFileHandler(
      inputFiles,
      currentFiles,
      chatUploadStoreRef.current,
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
          TipisTrack.track("chat_file_over_size", {
            parameter1: useTo,
            parameter3: file.size,
          })
          messageAPI.warning({
            content: t("dashboard.message.please_use_a_file_wi"),
          })
          setKnowledgeFiles(
            currentFiles.filter((file) => file.fileName !== item.fileName),
          )
          chatUploadStoreRef.current.deleteFileDetailInfo(item.queryID)
          continue
        }
        const fileID = await uploadChatFile(
          item.queryID,
          file,
          abortController.signal,
          chatUploadStoreRef.current,
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

  const handleClickStopGenerating = () => {
    TipisTrack.track("click_stop_generate")
    onCancelReceiving()
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
          senderID: currentUserInfo?.userID,
          senderType: SenderType.USER,
        },
        knowledgeFiles: realSendKnowledgeFiles,
      } as ChatMessage)
      setTextAreaVal("")
      setKnowledgeFiles([])
      chatUploadStoreRef.current.clearStore()
    }
  }, [currentUserInfo?.userID, knowledgeFiles, onSendMessage, textAreaVal])

  const handleClickSend = () => {
    const realSendKnowledgeFiles = knowledgeFiles.filter(
      (item) => !!item.fileID,
    )
    TipisTrack.track("click_send", {
      parameter2: realSendKnowledgeFiles.length,
      parameter3: "click",
    })

    sendAndClearMessage()
  }

  const handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault()

      if (disableSend) {
        return
      }
      const realSendKnowledgeFiles = knowledgeFiles.filter(
        (item) => !!item.fileID,
      )
      TipisTrack.track("click_send", {
        parameter2: realSendKnowledgeFiles.length,
        parameter3: "enter",
      })
      sendAndClearMessage()
    }
  }

  useEffect(() => {
    const chatUploadStore = chatUploadStoreRef.current
    return () => {
      chatUploadStore.clearStore()
    }
  }, [])

  return (
    <div css={previewChatContainerStyle}>
      <div ref={chatRef} css={chatContainerStyle}>
        {messagesList}
      </div>
      <div css={inputTextContainerStyle}>
        <AnimatePresence>
          {isRunning &&
            isReceiving &&
            getReadyState() === WS_READYSTATE.OPEN && (
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
                    onClick={handleClickStopGenerating}
                  />
                </div>
              </motion.div>
            )}
          {isRunning &&
            getReadyState() !== WS_READYSTATE.CONNECTING &&
            getReadyState() !== WS_READYSTATE.OPEN && (
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
                onKeyDown={handleInputKeyDown}
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
                onClick={handleClickSend}
              >
                {t("editor.ai-agent.button.send")}
              </Button>
            </div>
            <UploadKnowledgeFiles
              knowledgeFiles={knowledgeFiles}
              handleDeleteFile={handleDeleteFile}
              chatUploadStore={chatUploadStoreRef.current}
            />
          </div>
        ) : (
          <div css={inputContainerStyle}>
            <textarea
              value={textAreaVal}
              css={inputStyle}
              placeholder={t("editor.ai-agent.placeholder.send")}
              onKeyDown={handleInputKeyDown}
              onChange={(event) => {
                setTextAreaVal(event.target.value)
              }}
            />
            <div css={operationStyle}>
              <UploadKnowledgeFiles
                knowledgeFiles={knowledgeFiles}
                handleDeleteFile={handleDeleteFile}
                chatUploadStore={chatUploadStoreRef.current}
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
                  onClick={handleClickSend}
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
