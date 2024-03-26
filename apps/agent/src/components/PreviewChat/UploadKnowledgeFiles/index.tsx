import Icon from "@ant-design/icons"
import { Progress, Tag } from "antd"
import { FC } from "react"
import { getColor } from "@illa-public/color-scheme"
import { CloseIcon, getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import {
  FILE_ITEM_DETAIL_STATUS_IN_UI,
  IFileDetailInfo,
  UploadFileStore,
} from "@/utils/drive"
import {
  closeIconStyle,
  fileItemContainerStyle,
  fileTypeIconStyle,
} from "./style"

interface UploadKnowledgeFilesPops {
  knowledgeFiles: IKnowledgeFile[]
  handleDeleteFile: (
    name: string,
    needDelFromDrive: boolean,
    queryID?: string,
  ) => void
  chatUploadStore: UploadFileStore
}

const getIconByStatus = (fileInfo?: IFileDetailInfo) => {
  const { loaded = 1, total = 1, status, contentType } = fileInfo || {}
  switch (status) {
    case FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING:
    case FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING:
      const percent = (loaded / total) * 100
      return (
        <Progress
          type="circle"
          size={16}
          percent={percent > 90 ? 90 : parseFloat(percent.toFixed(2))}
          style={{
            marginRight: "4px",
          }}
        />
      )

    default:
    case FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR:
    case FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS:
      return getFileIconByContentType(
        GCS_OBJECT_TYPE.FILE,
        contentType,
        fileTypeIconStyle,
      )
  }
}

const UploadKnowledgeFiles: FC<UploadKnowledgeFilesPops> = ({
  handleDeleteFile,
  knowledgeFiles,
  chatUploadStore,
}) => {
  return (
    <div css={fileItemContainerStyle}>
      {knowledgeFiles.map((item) => {
        const fileInfo = chatUploadStore.getFileInfo(item.fileName)
        const isError = fileInfo?.status === FILE_ITEM_DETAIL_STATUS_IN_UI.ERROR
        let icon = getIconByStatus(fileInfo)
        return (
          <Tag
            key={item.fileName}
            closable
            closeIcon={
              <Icon component={CloseIcon} css={closeIconStyle(isError)} />
            }
            bordered
            onClose={() =>
              handleDeleteFile(
                item.fileName,
                fileInfo?.status === FILE_ITEM_DETAIL_STATUS_IN_UI.SUCCESS,
                fileInfo?.queryID,
              )
            }
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${isError ? getColor("red", "03") : getColor("grayBlue", "08")}`,
              color: isError
                ? getColor("red", "03")
                : getColor("grayBlue", "02"),
              padding: "5px 8px",
              borderRadius: "12px",
              backgroundColor: "white",
            }}
            icon={icon}
          >
            {item.fileName}
          </Tag>
        )
      })}
    </div>
  )
}

export default UploadKnowledgeFiles
