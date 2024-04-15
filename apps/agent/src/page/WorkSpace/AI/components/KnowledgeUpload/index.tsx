import Icon from "@ant-design/icons"
import { App } from "antd"
import {
  ChangeEvent,
  FC,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getFileIconByContentType } from "@illa-public/icon"
import { DeleteIcon, UploadIcon } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentId } from "@illa-public/user-data"
import {
  ACCEPT,
  MAX_FILE_SIZE,
  MAX_MESSAGE_FILES_LENGTH,
} from "@/config/constants/knowledge"
import { useDeleteKnowledgeFileMutation } from "@/redux/services/driveAPI"
import {
  FILE_ITEM_DETAIL_STATUS_IN_UI,
  IFileDetailInfo,
  useUploadFileToDrive,
} from "@/utils/drive"
import { multipleFileHandler } from "@/utils/drive/utils"
import { UploadContext } from "../../AIAgent/components/UploadContext"
import { IAgentForm } from "../../AIAgent/interface"
import StatusIcon from "./StatusIcon"
import { IKnowledgeUploadProps } from "./interface"
import {
  containerStyle,
  fileItemStyle,
  fileListContainerStyle,
  fileNameStyle,
  fileTypeIconStyle,
  iconHotSpotStyle,
  nameContainerStyle,
  opeationStyle,
  uploadAreaContainerStyle,
  uploadContentStyle,
  uploadTipiStyle,
} from "./style"

const mergeUploadValues = (
  values: IKnowledgeFile[],
  uploadFiles: IFileDetailInfo[],
): IFileDetailInfo[] => {
  const mergeValues = (values ?? []).map((item) => {
    return {
      ...item,
      loaded: 100,
      total: 100,
      status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
      queryID: item.fileID,
    }
  })
  return [...mergeValues, ...uploadFiles]
}

const KnowledgeUpload: FC<IKnowledgeUploadProps> = ({
  values = [],
  removeFile,
  addFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const { message: messageAPI, modal } = App.useApp()
  const { uploadKnowledgeFile } = useUploadFileToDrive()
  const [deleteKnowledgeFile] = useDeleteKnowledgeFileMutation()
  const teamID = useSelector(getCurrentId)!
  const { control } = useFormContext<IAgentForm>()
  const [aiAgentID] = useWatch({
    control,
    name: ["aiAgentID"],
  })
  const [isDragFileOver, setIsDragFileOver] = useState(false)
  const { uploadFileStore } = useContext(UploadContext)

  const uploadFiles = useSyncExternalStore(
    (listener) => uploadFileStore.subscribe(listener),
    () => uploadFileStore.getSnapshot(),
  )

  const currentValue = useMemo(
    () => mergeUploadValues(values, uploadFiles),
    [uploadFiles, values],
  )

  const validateFiles = (files: File[]) => {
    if (!files.length) return false
    if (files.length + values.length > MAX_MESSAGE_FILES_LENGTH) {
      TipisTrack.track("knowledge_file_over_num", {
        parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
        parameter3: files.length + values.length,
      })
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return false
    }
    return true
  }

  const uploadFilesToServer = async (files: File[]) => {
    TipisTrack.track("start_upload_knowledge_file", {
      parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
    })
    const currentFiles = [...currentValue]
    const formatFiles = multipleFileHandler(
      files,
      currentFiles,
      uploadFileStore,
    )
    try {
      for (let item of formatFiles) {
        const { fileName, file, abortController, queryID } = item
        if (!file) break
        if (file.size > MAX_FILE_SIZE) {
          TipisTrack.track("knowledge_file_over_size", {
            parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
            parameter3: file.size,
          })
          uploadFileStore.deleteFileDetailInfo(queryID)
          messageAPI.warning({
            content: t("dashboard.message.please_use_a_file_wi"),
          })
          continue
        }
        const fileID = await uploadKnowledgeFile(
          queryID,
          file,
          abortController.signal,
          uploadFileStore,
        )
        if (!!fileID) {
          const res = {
            fileName: fileName,
            contentType: file.type,
            fileID,
          }
          uploadFileStore.deleteFileDetailInfo(queryID)
          addFile(res)
        }
      }
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.bad_file"),
      })
    }
  }

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let inputFiles = Array.from(e.target.files || [])
    inputRef.current && (inputRef.current.value = "")
    if (!validateFiles(inputFiles)) return
    await uploadFilesToServer(inputFiles)
  }

  const handleDelete = (
    name: string,
    queryID: string,
    needDelFromDrive: boolean,
  ) => {
    modal.confirm({
      title: t("homepage.edit_tipi.modal.remove_file_title"),
      content: t("homepage.edit_tipi.modal.remove_file_desc"),
      okText: t("homepage.edit_tipi.modal.remove_file_ok"),
      okButtonProps: {
        danger: true,
      },
      centered: true,
      cancelText: t("homepage.edit_tipi.modal.remove_file_cancel"),
      onOk: () => {
        TipisTrack.track("knowledge_file_delete", {
          parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
        })
        try {
          removeFile(name)
          uploadFileStore.deleteFileDetailInfo(queryID)
          needDelFromDrive &&
            deleteKnowledgeFile({
              fileID: queryID,
              teamID,
            })
        } catch (e) {}
      },
    })
  }

  const handleClickUpload = () => {
    TipisTrack.track("click_upload_knowledge_file_entry", {
      parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
    })
    if (Array.isArray(values) && values.length >= MAX_MESSAGE_FILES_LENGTH) {
      TipisTrack.track("knowledge_file_over_num", {
        parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
        parameter3: values.length,
      })
      messageAPI.warning(t("dashboard.message.support_for_up_to_10"))
      return
    }
    inputRef.current?.click()
  }

  const handleClickRetry = (queryId: string) => {
    uploadFileStore.retryUpload(queryId, (...params) => {
      uploadKnowledgeFile(...params, uploadFileStore)
    })
  }

  useEffect(() => {
    return () => {
      uploadFileStore.clearStore()
    }
  }, [uploadFileStore])

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

  const handleOnDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.items.length === 0) return
    TipisTrack.track("start_upload_knowledge_file", {
      parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
      parameter2: "drag",
    })
    setIsDragFileOver(false)
    const { needUpdateFilesArray, notAcceptFilesArray } =
      getNeedUploadAndNotAcceptFiles(e.dataTransfer.files)

    if (notAcceptFilesArray.length > 0) {
      TipisTrack.track("knowledge_file_format_error", {
        parameter1: aiAgentID ? "edit_tipi" : "create_tipi",
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
      await uploadFilesToServer(needUpdateFilesArray)
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
    <div css={containerStyle}>
      <div>
        <div
          css={uploadAreaContainerStyle(isDragFileOver)}
          onClick={handleClickUpload}
          onDrop={handleOnDrop}
          onDragOver={handleOnDragOver}
          onDragLeave={handleOnDragLeave}
        >
          <div css={uploadContentStyle}>
            <Icon component={UploadIcon} />
            <p css={uploadTipiStyle}>
              {isDragFileOver
                ? t("homepage.tipi_chat.message.drop_to_upload")
                : t("homepage.tipi_chat.message.drag_to_upload")}
            </p>
          </div>
        </div>
        {/* <Button
          block
          size="large"
          icon={<Icon component={UploadIcon} />}
          onClick={handleClickUpload}
        >
          {t("homepage.edit_tipi.modal.upload")}
        </Button> */}
        <input
          style={{ display: "none" }}
          type="file"
          accept={ACCEPT.join(",")}
          ref={inputRef}
          multiple
          onChange={handleOnChange}
        />
      </div>
      {Array.isArray(currentValue) && currentValue.length > 0 && (
        <div css={fileListContainerStyle}>
          {currentValue.map((fileInfo) => (
            <div key={fileInfo.fileName} css={fileItemStyle}>
              <div css={nameContainerStyle}>
                {getFileIconByContentType(
                  GCS_OBJECT_TYPE.FILE,
                  fileInfo.contentType,
                  fileTypeIconStyle,
                )}
                <span css={fileNameStyle}>{fileInfo.fileName}</span>
              </div>
              <div css={opeationStyle}>
                <StatusIcon
                  loaded={fileInfo.loaded}
                  total={fileInfo.total}
                  status={fileInfo.status}
                  onClickRetry={() => handleClickRetry(fileInfo.queryID)}
                />
                <span
                  css={iconHotSpotStyle}
                  onClick={() =>
                    handleDelete(
                      fileInfo.fileName,
                      fileInfo.queryID,
                      fileInfo.status === FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
                    )
                  }
                >
                  <Icon component={DeleteIcon} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default KnowledgeUpload
