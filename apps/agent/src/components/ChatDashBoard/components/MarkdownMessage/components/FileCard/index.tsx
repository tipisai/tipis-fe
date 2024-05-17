import { FC } from "react"
import FileContent from "./FileContent"
import { messageListContainerStyle } from "./style"

interface IFileMessageCardProps {
  fileName: string
  contentType: string
  downloadURL: string
}

export const FileMessageCard: FC<IFileMessageCardProps> = ({
  fileName,
  contentType,
  downloadURL,
}) => {
  return (
    <div css={messageListContainerStyle}>
      <FileContent
        key={fileName}
        contentType={contentType}
        fileName={fileName}
        downloadURL={downloadURL}
      />
    </div>
  )
}
