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
import UnselectComponentIcon from "@/assets/agent/unselectComponent.svg?react"
import {
  ACCEPT,
  MAX_FILE_SIZE,
  MAX_MESSAGE_FILES_LENGTH,
} from "@/config/constants/knowledge"
import { UploadFileStore, useUploadFileToDrive } from "@/utils/drive"
import { multipleFileHandler } from "@/utils/drive/utils"
import { PreviewChatUseContext } from "../../PreviewChatUseContext"
import UploadButton from "../../UploadButton"
import UploadKnowledgeFiles from "../../UploadKnowledgeFiles"
import { ChatMessage, SenderType } from "../../interface"
import { IInputAreaProps } from "../interface"
import { inputStyle, operationStyle, sendButtonStyle } from "../style"
import {
  inputContainerStyle,
  uploadContentStyle,
  uploadContentTipStyle,
  uploadDropZoneStyle,
} from "./style"

const PCInputArea: FC<IInputAreaProps> = ({ isReceiving, onSendMessage }) => {
  const { t } = useTranslation()
  const { message: messageAPI } = App.useApp()
  const { useTo } = useContext(PreviewChatUseContext)
  const { data: currentUserInfo } = useGetUserInfoQuery(null)
  const currentUserID = currentUserInfo?.userID || ""

  const inputRef = useRef<HTMLInputElement>(null)
  const [textAreaVal, setTextAreaVal] = useState("")
  const [isDragFileOver, setIsDragFileOver] = useState(false)
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

  const uploadFiles = async (files: File[]) => {
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let inputFiles = Array.from(e.target.files || [])
    inputRef.current && (inputRef.current.value = "")

    const validateResult = validateFiles(inputFiles)
    if (!validateResult) return
    await uploadFiles(inputFiles)
  }

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
          senderID: currentUserID,
          senderType: SenderType.USER,
        },
        knowledgeFiles: realSendKnowledgeFiles,
      } as ChatMessage)
      setTextAreaVal("")
      setKnowledgeFiles([])
      chatUploadStoreRef.current.clearStore()
    }
  }, [currentUserID, knowledgeFiles, onSendMessage, textAreaVal])

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

  const getNeedUploadAndNotAcceptFiles = (files: FileList) => {
    const acceptType = ACCEPT

    const needUpdateFilesArray = Array.from(files).filter((file) =>
      acceptType.includes(file.type),
    )
    const notAcceptFilesArray = Array.from(files).filter(
      (file) => !acceptType.includes(file.type),
    )

    return { needUpdateFilesArray, notAcceptFilesArray }
  }

  const handleOnPaste = async (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.clipboardData.files.length === 0) return
    TipisTrack.track("click_upload_chat_file_entry", {
      parameter1: useTo,
      parameter2: "paste",
    })
    e.preventDefault()

    const { needUpdateFilesArray, notAcceptFilesArray } =
      getNeedUploadAndNotAcceptFiles(e.clipboardData.files)

    if (notAcceptFilesArray.length > 0) {
      TipisTrack.track("chat_file_format_error", {
        parameter1: useTo,
        parameter2: "paste",
        parameter3: notAcceptFilesArray.map((file) => file.type),
      })
      messageAPI.warning({
        content: t("homepage.tipi_chat.message.failed_to_add"),
      })
    }
    if (needUpdateFilesArray.length > 0) {
      const validateResult = validateFiles(needUpdateFilesArray)
      if (!validateResult) return
      await uploadFiles(needUpdateFilesArray)
    }
  }

  const handleOnDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.items.length === 0) return
    TipisTrack.track("click_upload_chat_file_entry", {
      parameter1: useTo,
      parameter2: "drag",
    })
    setIsDragFileOver(false)
    const { needUpdateFilesArray, notAcceptFilesArray } =
      getNeedUploadAndNotAcceptFiles(e.dataTransfer.files)

    if (notAcceptFilesArray.length > 0) {
      TipisTrack.track("chat_file_format_error", {
        parameter1: useTo,
        parameter2: "drag",
        parameter3: notAcceptFilesArray.map((file) => file.type),
      })
      messageAPI.warning({
        content: t("homepage.tipi_chat.message.failed_to_add"),
      })
    }
    if (needUpdateFilesArray.length > 0) {
      const validateResult = validateFiles(needUpdateFilesArray)
      if (!validateResult) return
      await uploadFiles(needUpdateFilesArray)
    }
  }

  const handleOnDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragFileOver(true)
  }

  const handleOnDragLeave = () => {
    setIsDragFileOver(false)
  }

  return (
    <div
      css={inputContainerStyle}
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      onDragLeave={handleOnDragLeave}
    >
      <textarea
        value={textAreaVal}
        css={inputStyle}
        placeholder={t("editor.ai-agent.placeholder.send")}
        onKeyDown={handleInputKeyDown}
        onPaste={handleOnPaste}
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
      {isDragFileOver && (
        <div css={uploadDropZoneStyle}>
          <div css={uploadContentStyle}>
            <UnselectComponentIcon />
            <p css={uploadContentTipStyle}>
              {t("homepage.tipi_chat.message.release_to_upload")}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PCInputArea
