import Icon from "@ant-design/icons"
import { Progress, Tag } from "antd"
import { FC } from "react"
import { useRaf } from "react-use"
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
  handleDeleteFile: (name: string, queryID?: string) => void
  chatUploadStore: UploadFileStore
}

const StatusIcon: FC<
  Partial<Pick<IFileDetailInfo, "status" | "contentType">>
> = ({ status, contentType }) => {
  const loadedNum = useRaf(3000, 0)
  switch (status) {
    case FILE_ITEM_DETAIL_STATUS_IN_UI.WAITING:
      return (
        <Progress
          type="circle"
          size={16}
          percent={0}
          style={{
            marginRight: "4px",
          }}
        />
      )
    case FILE_ITEM_DETAIL_STATUS_IN_UI.PROCESSING:
      return (
        <Progress
          type="circle"
          size={16}
          percent={parseFloat((loadedNum * 85).toFixed(2))}
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
        return (
          <Tag
            key={item.fileName}
            closable
            closeIcon={
              <Icon component={CloseIcon} css={closeIconStyle(isError)} />
            }
            bordered
            onClose={() => handleDeleteFile(item.fileName, fileInfo?.queryID)}
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
            icon={
              <StatusIcon
                status={fileInfo?.status}
                contentType={fileInfo?.contentType}
              />
            }
          >
            {item.fileName}
          </Tag>
        )
      })}
    </div>
  )
}

export default UploadKnowledgeFiles
