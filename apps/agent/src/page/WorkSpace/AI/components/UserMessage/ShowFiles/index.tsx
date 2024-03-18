import { FC } from "react"
import { getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import {
  containerStyle,
  fileItemStyle,
  fileNameStyle,
  fileTypeIconStyle,
  iconContainerStyle,
} from "./style"

interface ShowFilesProps {
  knowledgeFiles: IKnowledgeFile[]
}
const ShowFiles: FC<ShowFilesProps> = ({ knowledgeFiles }) => {
  return (
    <div css={containerStyle}>
      {knowledgeFiles.map((item) => (
        <div key={item.fileName} css={fileItemStyle}>
          <span css={iconContainerStyle}>
            {getFileIconByContentType(
              GCS_OBJECT_TYPE.FILE,
              item.contentType,
              fileTypeIconStyle,
            )}
          </span>
          <span css={fileNameStyle}>{item.fileName}</span>
        </div>
      ))}
    </div>
  )
}

export default ShowFiles
