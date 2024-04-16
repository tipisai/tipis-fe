import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { DownloadIcon, getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import { handleDownloadFiles } from "@/utils/drive/download"
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
  const handleDownload = (fileName: string, downloadURL: string) => {
    if (!downloadURL || !fileName) {
      return
    }
    const fileInfo = {
      name: fileName,
      downloadURL: downloadURL,
    }
    handleDownloadFiles([fileInfo])
  }
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
          <Button
            icon={<Icon component={DownloadIcon} />}
            onClick={() => handleDownload(item.fileName, item.downloadURL!)}
            size="small"
          />
        </div>
      ))}
    </div>
  )
}

export default ShowFiles
