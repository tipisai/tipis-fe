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
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import { isPremiumModel } from "@illa-public/market-agent"
import {
  ILLA_MIXPANEL_BUILDER_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
} from "@illa-public/mixpanel-utils"
import { AI_AGENT_TYPE, Agent, IKnowledgeFile } from "@illa-public/public-types"
import { getCurrentUser } from "@illa-public/user-data"
import { ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import AgentBlockInput from "@/assets/agent/agent-block-input.svg?react"
import StopIcon from "@/assets/agent/stop.svg?react"
import AIAgentMessage from "@/page/WorkSpace/AI/components/AIAgentMessage"
import { GenerationMessage } from "@/page/WorkSpace/AI/components/GenerationMessage"
import {
  ChatMessage,
  ChatSendRequestPayload,
  PreviewChatProps,
  SenderType,
} from "@/page/WorkSpace/AI/components/PreviewChat/interface"
import {
  blockInputContainerStyle,
  blockInputTextStyle,
  chatContainerStyle,
  generatingContainerStyle,
  generatingContentContainerStyle,
  generatingDividerStyle,
  generatingTextStyle,
  inputStyle,
  inputTextContainerStyle,
  mobileInputContainerStyle,
  mobileInputElementStyle,
  mobileInputStyle,
  operationStyle,
  previewChatContainerStyle,
  sendButtonStyle,
  stopIconStyle,
} from "@/page/WorkSpace/AI/components/PreviewChat/style"
import UserMessage from "@/page/WorkSpace/AI/components/UserMessage"
import { handleParseFile } from "@/utils/file"
import { TextSignal } from "../../../../../api/ws/textSignal"
import { track } from "../../../../../utils/mixpanelHelper"
import { AgentWSContext } from "../../context/AgentWSContext"
import {
  MAX_FILE_SIZE,
  MAX_MESSAGE_FILES_LENGTH,
} from "../KnowledgeUpload/contants"
import UploadButton from "./UploadButton"
import UploadKnowledgeFiles from "./UploadKnowledgeFiles"

export const PreviewChat: FC<PreviewChatProps> = (props) => {
  const { isMobile, agentType, blockInput, editState, model } = props

  const {
    wsStatus,
    isRunning,
    chatMessages,
    generationMessage,
    isReceiving,
    sendMessage,
    setIsReceiving,
  } = useContext(AgentWSContext)
  const { getValues, control } = useFormContext<Agent>()
  const [aiAgentID] = useWatch({
    control: control,
    name: ["aiAgentID"],
  })

  const onSendMessage = useCallback(
    (message: ChatMessage, agentType: AI_AGENT_TYPE) => {
      track(
        ILLA_MIXPANEL_EVENT_TYPE.CLICK,
        ILLA_MIXPANEL_BUILDER_PAGE_NAME.AI_AGENT_RUN,
        {
          element: "send",
          parameter5: aiAgentID,
        },
      )
      sendMessage(
        {
          threadID: message.threadID,
          prompt: message.message,
          variables: [],
          actionID: getValues("aiAgentID"),
          modelConfig: getValues("modelConfig"),
          model: getValues("model"),
          agentType: getValues("agentType"),
        } as ChatSendRequestPayload,
        TextSignal.RUN,
        agentType,
        "chat",
        true,
        message,
      )
    },
    [aiAgentID, getValues, sendMessage],
  )

  const onCancelReceiving = useCallback(() => {
    sendMessage(
      {} as ChatSendRequestPayload,
      TextSignal.STOP_ALL,
      agentType,
      "stop_all",
      false,
    )
    setIsReceiving(false)
  }, [agentType, sendMessage, setIsReceiving])

  const currentUserInfo = useSelector(getCurrentUser)
  const { message: messageAPI } = App.useApp()

  const chatRef = useRef<HTMLDivElement>(null)

  const [textAreaVal, setTextAreaVal] = useState("")
  const [knowledgeFiles, setKnowledgeFiles] = useState<IKnowledgeFile[]>([])
  const [parseKnowledgeLoading, setParseKnowledgeLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const canShowKnowledgeFiles = isPremiumModel(model)

  const { t } = useTranslation()

  const messagesList = useMemo(() => {
    return chatMessages.map((message, i) => {
      if (
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
      }
      return (
        <AIAgentMessage
          key={message.threadID}
          message={message}
          isMobile={isMobile}
          canShowLongCopy={i === chatMessages.length - 1 && !isReceiving}
        />
      )
    })
  }, [chatMessages, currentUserInfo.userID, isMobile, isReceiving])

  const handleDeleteFile = (fileName: string) => {
    const files = knowledgeFiles.filter((file) => file.name !== fileName)
    setKnowledgeFiles(files)
  }

  const handleUploadFile = () => {
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
    setParseKnowledgeLoading(true)
    const currentFiles = [...knowledgeFiles]
    try {
      for (let file of inputFiles) {
        if (!file) break
        if (file.size > MAX_FILE_SIZE) {
          messageAPI.warning({
            content: t("dashboard.message.please_use_a_file_wi"),
          })
          return
        }
        const index = currentFiles.findIndex(
          (item) => item.name === file.name && item.type === file.type,
        )
        const fileName =
          index !== -1
            ? `${file.name.split(".")[0]}(${v4().slice(0, 3)})`
            : file.name

        currentFiles.push({
          name: fileName,
          type: file.type,
        })
        setKnowledgeFiles(currentFiles)
        const value = await handleParseFile(file, true)
        if (value === "") {
          messageAPI.warning({
            content: t("dashboard.message.no_usable_text_conte"),
          })
          handleDeleteFile(fileName)
          return
        }
        const afterParseFilesIndex = currentFiles.findIndex(
          (item) => item.name === file.name && item.type === file.type,
        )
        if (afterParseFilesIndex !== -1) {
          const needUpdateFile = currentFiles[afterParseFilesIndex]
          if (!needUpdateFile.value) {
            currentFiles.splice(afterParseFilesIndex, 1, {
              ...needUpdateFile,
              ...file,
              value,
            })
          }
        } else {
          currentFiles.push({
            name: fileName,
            type: file.type,
            value,
          })
        }
        setKnowledgeFiles(currentFiles)
      }
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.bad_file"),
      })
    } finally {
      setParseKnowledgeLoading(false)
    }
  }

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
    })
  }, [chatMessages, generationMessage])

  const sendAndClearMessage = useCallback(() => {
    if (
      (textAreaVal !== "" || knowledgeFiles.length > 0) &&
      !parseKnowledgeLoading
    ) {
      onSendMessage(
        {
          threadID: v4(),
          message: textAreaVal,
          sender: {
            senderID: currentUserInfo.userID,
            senderType: SenderType.USER,
          },
          knowledgeFiles: knowledgeFiles,
        } as ChatMessage,
        agentType,
      )
      setTextAreaVal("")
      setKnowledgeFiles([])
    }
  }, [
    agentType,
    currentUserInfo.userID,
    knowledgeFiles,
    onSendMessage,
    parseKnowledgeLoading,
    textAreaVal,
  ])

  const generationBlock = useMemo(() => {
    return (
      generationMessage && <GenerationMessage message={generationMessage} />
    )
  }, [generationMessage])

  return (
    <div css={previewChatContainerStyle}>
      <div ref={chatRef} css={chatContainerStyle}>
        {agentType === AI_AGENT_TYPE.CHAT ? messagesList : generationBlock}
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
                    if (isReceiving || blockInput) {
                      return
                    }
                    sendAndClearMessage()
                  }
                }}
                onChange={(v) => {
                  setTextAreaVal(v.target.value)
                }}
              />
              {canShowKnowledgeFiles && (
                <UploadButton
                  handleClick={handleUploadFile}
                  parseKnowledgeLoading={parseKnowledgeLoading}
                  handleFileChange={handleFileChange}
                  ref={inputRef}
                />
              )}
              <Button
                disabled={isReceiving || blockInput}
                onClick={() => {
                  sendAndClearMessage()
                }}
              >
                {t("editor.ai-agent.button.send")}
              </Button>
            </div>
            {canShowKnowledgeFiles && (
              <UploadKnowledgeFiles
                knowledgeFiles={knowledgeFiles}
                handleDeleteFile={handleDeleteFile}
              />
            )}
          </div>
        ) : (
          <>
            <textarea
              value={textAreaVal}
              css={inputStyle}
              placeholder={t("editor.ai-agent.placeholder.send")}
              onKeyDown={(event) => {
                if (event.keyCode === 13 && !event.shiftKey) {
                  event.preventDefault()
                  if (isReceiving || blockInput) {
                    return
                  }
                  sendAndClearMessage()
                }
              }}
              onChange={(event) => {
                setTextAreaVal(event.target.value)
              }}
            />
            <div css={operationStyle(canShowKnowledgeFiles)}>
              {canShowKnowledgeFiles && (
                <UploadKnowledgeFiles
                  knowledgeFiles={knowledgeFiles}
                  handleDeleteFile={handleDeleteFile}
                />
              )}
              <div css={sendButtonStyle}>
                {canShowKnowledgeFiles && (
                  <UploadButton
                    handleClick={handleUploadFile}
                    parseKnowledgeLoading={parseKnowledgeLoading}
                    handleFileChange={handleFileChange}
                    ref={inputRef}
                  />
                )}
                <Button
                  disabled={isReceiving || blockInput}
                  onClick={() => {
                    sendAndClearMessage()
                  }}
                >
                  {t("editor.ai-agent.button.send")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
