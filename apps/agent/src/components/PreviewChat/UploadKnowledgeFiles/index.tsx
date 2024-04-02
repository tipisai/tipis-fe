import Icon from "@ant-design/icons"
import { Tag } from "antd"
import { FC } from "react"
import { getColor } from "@illa-public/color-scheme"
import { CloseIcon } from "@illa-public/icon"
import { IKnowledgeFile } from "@illa-public/public-types"
import { FILE_ITEM_DETAIL_STATUS_IN_UI, UploadFileStore } from "@/utils/drive"
import StatusIcon from "./StatusIcon"
import { closeIconStyle, fileItemContainerStyle, fileNameStyle } from "./style"

interface UploadKnowledgeFilesPops {
  knowledgeFiles: IKnowledgeFile[]
  handleDeleteFile: (name: string, queryID?: string) => void
  chatUploadStore: UploadFileStore
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
              marginInlineEnd: 0,
            }}
            icon={
              <StatusIcon
                loaded={fileInfo?.loaded}
                total={fileInfo?.total}
                status={fileInfo?.status}
                contentType={item?.contentType}
              />
            }
          >
            <span css={fileNameStyle}>{item.fileName}</span>
          </Tag>
        )
      })}
    </div>
  )
}

export default UploadKnowledgeFiles
