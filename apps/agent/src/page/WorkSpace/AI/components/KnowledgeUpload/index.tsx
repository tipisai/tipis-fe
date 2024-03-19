import Icon from "@ant-design/icons"
import { App, Button, Progress } from "antd"
import { ChangeEvent, FC, useMemo, useRef, useSyncExternalStore } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getColor } from "@illa-public/color-scheme"
import { getFileIconByContentType } from "@illa-public/icon"
import { DeleteIcon, SuccessIcon, UploadIcon } from "@illa-public/icon"
import { ErrorIcon } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import {
  ACCEPT,
  MAX_FILE_SIZE,
  MAX_MESSAGE_FILES_LENGTH,
  UPLOAD_PATH,
} from "@/config/constants/knowledge"
import { useDeleteFileMutation } from "@/redux/services/driveAPI"
import {
  FILE_ITEM_DETAIL_STATUS_IN_UI,
  FileDetailInfos,
  updateFileDetailStore,
  useUploadFileToDrive,
} from "@/utils/drive"
import { multipleFileHandler } from "@/utils/drive/utils"
import {
  fileItemStyle,
  fileListContainerStyle,
  fileNameStyle,
  fileTypeIconStyle,
  iconHotSpotStyle,
  nameContainerStyle,
  opeationStyle,
} from "./style"

interface KnowledgeUploadProps {
  addFile: (file: IKnowledgeFile, isUpdate?: boolean) => void
  removeFile: (name: string) => void
  values: IKnowledgeFile[]
}

const getIconByStatus = (
  status: FILE_ITEM_DETAIL_STATUS_IN_UI,
  total?: number,
  loaded?: number,
  onClickRetry?: () => void,
) => {
  switch (status) {
    case FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING:
      const percent = (loaded! / total!) * 100
      return (
        <Progress
          type="circle"
          percent={percent > 90 ? 90 : parseFloat(percent.toFixed(2))}
        />
      )

    case FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS:
      return (
        <SuccessIcon
          style={{
            color: getColor("green", "03"),
          }}
        />
      )
    case FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR:
      return (
        <Icon
          component={ErrorIcon}
          onClick={onClickRetry}
          style={{
            color: getColor("red", "03"),
          }}
        />
      )
    default:
      return null
  }
}

const mergeUploadValues = (
  values: IKnowledgeFile[],
  uploadFiles: FileDetailInfos[],
): FileDetailInfos[] => {
  const mergeValues = values.map((item) => {
    return {
      ...item,
      status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
      loaded: 0,
      total: 0,
      queryID: item.value,
    }
  })
  return [...mergeValues, ...uploadFiles]
}

const KnowledgeUpload: FC<KnowledgeUploadProps> = ({
  values = [],
  removeFile,
  addFile,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const { message: messageAPI, modal } = App.useApp()
  const { uploadFileToDrive } = useUploadFileToDrive()
  const [deleteFile] = useDeleteFileMutation()
  const teamID = useSelector(getCurrentId)!

  const uploadFiles = useSyncExternalStore(
    updateFileDetailStore.subscribe,
    updateFileDetailStore.getSnapshot,
  )

  const currentValue = useMemo(
    () => mergeUploadValues(values, uploadFiles),
    [uploadFiles, values],
  )

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    let inputFiles = Array.from(e.target.files || [])
    inputRef.current && (inputRef.current.value = "")
    if (!inputFiles.length) return
    if (inputFiles.length + values.length > MAX_MESSAGE_FILES_LENGTH) {
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return
    }
    const currentFiles = [...currentValue]
    const uploadParams = {
      folder: UPLOAD_PATH,
      allowAnonymous: false,
      replace: false,
    }
    const formatFiles = multipleFileHandler(
      inputFiles,
      currentFiles,
      uploadParams,
    )
    try {
      for (let item of formatFiles) {
        const { fileName, file, abortController, queryID } = item
        if (!file) break
        if (file.size > MAX_FILE_SIZE) {
          messageAPI.warning({
            content: t("dashboard.message.please_use_a_file_wi"),
          })
          return
        }
        let uploadRes
        uploadRes = await uploadFileToDrive(
          queryID,
          file,
          uploadParams,
          abortController.signal,
        )
        if (!!uploadRes) {
          const res = {
            fileName: fileName,
            contentType: file.type,
            value: uploadRes.id,
          }
          updateFileDetailStore.deleteFileDetailInfo(queryID)
          addFile(res)
        }
      }
    } catch (e) {
      messageAPI.error({
        content: t("dashboard.message.bad_file"),
      })
    }
  }

  const handleDelete = (
    name: string,
    queryID: string,
    needDelFromDrive: boolean,
  ) => {
    modal.confirm({
      title: t("drive.modal.delete_going_on_task.title"),
      content: t("drive.modal.delete_going_on_task.description"),
      okText: t("drive.modal.delete_going_on_task.delete"),
      cancelText: t("drive.modal.delete_going_on_task.cancel"),
      onOk: () => {
        try {
          removeFile(name)
          updateFileDetailStore.deleteFileDetailInfo(queryID)
          needDelFromDrive &&
            deleteFile({
              fileID: queryID,
              teamID,
            })
        } catch (e) {}
      },
    })
  }

  const handleClickUpload = () => {
    if (Array.isArray(values) && values.length >= MAX_MESSAGE_FILES_LENGTH) {
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return
    }
    inputRef.current?.click()
  }

  const handleClickRetry = (queryId: string) => {
    updateFileDetailStore.retryUpload(queryId, uploadFileToDrive)
  }

  return (
    <>
      <div>
        <Button
          block
          size="large"
          icon={<Icon component={UploadIcon} />}
          onClick={handleClickUpload}
        >
          Upload
        </Button>
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
                {getIconByStatus(
                  fileInfo.status,
                  fileInfo?.total,
                  fileInfo?.loaded,
                  () => handleClickRetry(fileInfo.fileName),
                )}
                <span
                  css={iconHotSpotStyle(fileInfo.status)}
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
    </>
  )
}

export default KnowledgeUpload
