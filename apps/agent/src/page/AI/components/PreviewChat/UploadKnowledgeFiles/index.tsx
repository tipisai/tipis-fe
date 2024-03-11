import { Tag } from "antd"
import { FC } from "react"
import { getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import { fileItemContainerStyle, fileTypeIconStyle } from "./style"

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
          key={item.name}
          closable
          onClose={() => handleDeleteFile(item.name)}
          // maxW="300px"
          // bg={getColor("grayBlue", "09")}
          icon={getFileIconByContentType(
            GCS_OBJECT_TYPE.FILE,
            item.type,
            fileTypeIconStyle,
          )}
        >
          {item.name}
        </Tag>
      ))}
    </div>
  )
}

export default UploadKnowledgeFiles
