import Icon from "@ant-design/icons"
import { App, Button } from "antd"
import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { SendIcon } from "@illa-public/icon"
import { IKnowledgeFile } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import {
  MAX_FILE_SIZE,
  MAX_MESSAGE_FILES_LENGTH,
} from "@/config/constants/knowledge"
import { UploadFileStore, useUploadFileToDrive } from "@/utils/drive"
import { multipleFileHandler } from "@/utils/drive/utils"
import { PRESET_OPTION_ID } from "../../PresetOptions/constants"
import { useGetPrompt } from "../../PresetOptions/hook"
import PresetOptions from "../../PresetOptions/mobile"
import { PreviewChatUseContext } from "../../PreviewChatUseContext"
import { PREVIEW_CHAT_USE_TO } from "../../PreviewChatUseContext/constants"
import UploadButton from "../../UploadButton"
import UploadKnowledgeFiles from "../../UploadKnowledgeFiles"
import { ChatMessage, SenderType } from "../../interface"
import { IInputAreaProps } from "../interface"
import { inputStyle, operationStyle, sendButtonStyle } from "../style"

const MobileInputArea: FC<IInputAreaProps> = (props) => {
  const { isReceiving, onSendMessage, hasMessage } = props
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()
  const { useTo } = useContext(PreviewChatUseContext)
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const currentUserID = currentUserInfo?.userID || ""

  const inputRef = useRef<HTMLInputElement>(null)
  const [textAreaVal, setTextAreaVal] = useState("")
  const [knowledgeFiles, setKnowledgeFiles] = useState<IKnowledgeFile[]>([])
  const [uploadKnowledgeLoading, setUploadKnowledgeLoading] = useState(false)

  const disableSend =
    isReceiving || uploadKnowledgeLoading || textAreaVal === ""

  const { uploadChatFile } = useUploadFileToDrive()

  const chatUploadStoreRef = useRef(new UploadFileStore())
  useEffect(() => {
    const chatUploadStore = chatUploadStoreRef.current
    return () => {
      chatUploadStore.clearStore()
    }
  }, [])

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
      parameter2: "select",
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

  const validateFiles = (files: File[]) => {
    if (!files.length) return false
    if (files.length + knowledgeFiles.length > MAX_MESSAGE_FILES_LENGTH) {
      TipisTrack.track("chat_file_over_num", {
        parameter1: useTo,
        parameter3: files.length + knowledgeFiles.length,
      })
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return false
    }
    return true
  }

  const uploadFiles = useCallback(
    async (files: File[], knowledgeFiles: IKnowledgeFile[]) => {
      TipisTrack.track("start_upload_chat_file", {
        parameter1: useTo,
      })
      setUploadKnowledgeLoading(true)
      const currentFiles = [...knowledgeFiles]

      const formatFiles = multipleFileHandler(
        files,
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
          const uploadRes = await uploadChatFile(
            item.queryID,
            file,
            abortController.signal,
            chatUploadStoreRef.current,
          )

          if (!!uploadRes) {
            const res = {
              fileName: fileName,
              contentType: file.type,
              fileID: uploadRes.id,
              downloadURL: uploadRes.downloadURL,
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
    },
    [messageAPI, t, uploadChatFile, useTo],
  )

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let inputFiles = Array.from(e.target.files || [])
    inputRef.current && (inputRef.current.value = "")

    const validateResult = validateFiles(inputFiles)
    if (!validateResult) return
    await uploadFiles(inputFiles, knowledgeFiles)
  }

  const sendAndClearMessage = useCallback(
    (textMessage: string, knowledgeFiles: IKnowledgeFile[]) => {
      const realSendKnowledgeFiles = knowledgeFiles.filter(
        (item) => !!item.fileID,
      )
      if (
        (textMessage !== "" && realSendKnowledgeFiles.length > 0) ||
        (textMessage !== "" && realSendKnowledgeFiles.length === 0)
      ) {
        onSendMessage({
          threadID: v4(),
          message: textMessage,
          sender: {
            senderID: currentUserID,
            senderType: SenderType.USER,
          },
          knowledgeFiles: realSendKnowledgeFiles,
        } as ChatMessage)
        setTextAreaVal("")
        setKnowledgeFiles([])
        chatUploadStoreRef.current.clearStore()
      }
    },
    [currentUserID, onSendMessage],
  )

  const handleClickSend = () => {
    const realSendKnowledgeFiles = knowledgeFiles.filter(
      (item) => !!item.fileID,
    )
    TipisTrack.track("click_send", {
      parameter2: realSendKnowledgeFiles.length,
      parameter3: "click",
    })

    sendAndClearMessage(textAreaVal, knowledgeFiles)
  }

  const getPPromptByID = useGetPrompt()

  const handleClickCard = useCallback(
    async (cardID: PRESET_OPTION_ID) => {
      const { messagePrompt, filePrompt } = await getPPromptByID(cardID)
      switch (cardID) {
        case PRESET_OPTION_ID.DATA_ANALYZE: {
          sendAndClearMessage(messagePrompt, [])
          break
        }
        case PRESET_OPTION_ID.INVOICE_PDF_PROCESS:
        case PRESET_OPTION_ID.PROCESS_EXCEL_FILES:
        case PRESET_OPTION_ID.GENERATE_A_GRAPHIC_REPORT: {
          setTextAreaVal(messagePrompt)
          await uploadFiles(filePrompt, [])
        }
      }
    },
    [getPPromptByID, sendAndClearMessage, uploadFiles],
  )

  return (
    <>
      {useTo === PREVIEW_CHAT_USE_TO.DEFAULT_CHAT && !hasMessage && (
        <PresetOptions onClickCard={handleClickCard} />
      )}
      <div>
        <textarea
          value={textAreaVal}
          css={inputStyle}
          placeholder={t("editor.ai-agent.placeholder.send")}
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
    </>
  )
}

export default MobileInputArea
