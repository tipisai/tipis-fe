import Icon from "@ant-design/icons"
import { Tag } from "antd"
import { FC } from "react"
import { getColor } from "@illa-public/color-scheme"
import { CloseIcon, getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import {
  closeIconStyle,
  fileItemContainerStyle,
  fileTypeIconStyle,
} from "./style"

interface UploadKnowledgeFilesPops {
  knowledgeFiles: IKnowledgeFile[]
  handleDeleteFile: (name: string) => void
}

const UploadKnowledgeFiles: FC<UploadKnowledgeFilesPops> = ({
  handleDeleteFile,
  knowledgeFiles,
}) => {
  return (
    <div css={fileItemContainerStyle}>
      {knowledgeFiles.map((item) => (
        <Tag
          key={item.fileName}
          closable
          closeIcon={<Icon component={CloseIcon} css={closeIconStyle} />}
          bordered
          onClose={() => handleDeleteFile(item.fileName)}
          style={{
            display: "flex",
            alignItems: "center",
            border: `1px solid ${getColor("grayBlue", "08")}`,
            padding: "5px 8px",
            borderRadius: "12px",
            backgroundColor: "white",
          }}
          icon={getFileIconByContentType(
            GCS_OBJECT_TYPE.FILE,
            item.contentType,
            fileTypeIconStyle,
          )}
        >
          {item.fileName}
        </Tag>
      ))}
    </div>
  )
}

export default UploadKnowledgeFiles
