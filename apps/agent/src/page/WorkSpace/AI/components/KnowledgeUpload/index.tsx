import Icon from "@ant-design/icons"
import { App, Button, Progress } from "antd"
import { ChangeEvent, FC, useMemo, useRef, useSyncExternalStore } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useRaf } from "react-use"
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
} from "@/config/constants/knowledge"
import { useDeleteKnowledgeFileMutation } from "@/redux/services/driveAPI"
import {
  FILE_ITEM_DETAIL_STATUS_IN_UI,
  IFileDetailInfo,
  UploadFileStore,
  useUploadFileToDrive,
} from "@/utils/drive"
import { multipleFileHandler } from "@/utils/drive/utils"
import { IKnowledgeUploadProps, IStatusIconProps } from "./interface"
import {
  containerStyle,
  fileItemStyle,
  fileListContainerStyle,
  fileNameStyle,
  fileTypeIconStyle,
  iconHotSpotStyle,
  nameContainerStyle,
  opeationStyle,
} from "./style"

const editPanelUpdateFileDetailStore = new UploadFileStore()

const StatusIcon: FC<IStatusIconProps> = ({ status, onClickRetry }) => {
  const loadedNum = useRaf(3000, 0)
  switch (status) {
    case FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING:
      return <Progress type="circle" size={16} percent={0} />
    case FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING:
      return (
        <Progress
          type="circle"
          size={16}
          strokeLinecap="square"
          percent={parseFloat((loadedNum * 85).toFixed(2))}
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
  uploadFiles: IFileDetailInfo[],
): IFileDetailInfo[] => {
  const mergeValues = values.map((item) => {
    return {
      ...item,
      status: FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
      queryID: item.value,
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

  const uploadFiles = useSyncExternalStore(
    (listener) => editPanelUpdateFileDetailStore.subscribe(listener),
    () => editPanelUpdateFileDetailStore.getSnapshot(),
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
    const formatFiles = multipleFileHandler(
      inputFiles,
      currentFiles,
      editPanelUpdateFileDetailStore,
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
        const fileID = await uploadKnowledgeFile(
          queryID,
          file,
          abortController.signal,
          editPanelUpdateFileDetailStore,
        )
        if (!!fileID) {
          const res = {
            fileName: fileName,
            contentType: file.type,
            value: fileID,
          }
          editPanelUpdateFileDetailStore.deleteFileDetailInfo(queryID)
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
          editPanelUpdateFileDetailStore.deleteFileDetailInfo(queryID)
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
    if (Array.isArray(values) && values.length >= MAX_MESSAGE_FILES_LENGTH) {
      messageAPI.warning({
        content: t("dashboard.message.support_for_up_to_10"),
      })
      return
    }
    inputRef.current?.click()
  }

  const handleClickRetry = (queryId: string) => {
    editPanelUpdateFileDetailStore.retryUpload(queryId, (...params) => {
      uploadKnowledgeFile(...params, editPanelUpdateFileDetailStore)
    })
  }

  return (
    <div css={containerStyle}>
      <div>
        <Button
          block
          size="large"
          icon={<Icon component={UploadIcon} />}
          onClick={handleClickUpload}
        >
          {t("upload")}
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
                <StatusIcon
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
