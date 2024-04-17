import { FC } from "react"
import { useTranslation } from "react-i18next"
import { getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE, IKnowledgeFile } from "@illa-public/public-types"
import {
  errorInfoStyle,
  fileInfoStyle,
  fileItemStyle,
  fileNameStyle,
  fileTypeIconStyle,
  iconContainerStyle,
} from "./style"

interface IFileContentProps
  extends Pick<IKnowledgeFile, "contentType" | "fileName"> {
  isExpired?: boolean
}

const FileContent: FC<IFileContentProps> = ({
  contentType,
  fileName,
  isExpired,
}) => {
  const { t } = useTranslation()
  return (
    <div css={fileItemStyle}>
      <span css={iconContainerStyle}>
        {getFileIconByContentType(
          GCS_OBJECT_TYPE.FILE,
          contentType,
          fileTypeIconStyle,
        )}
      </span>
      <span css={fileInfoStyle}>
        <span css={fileNameStyle}>{fileName}</span>
        {isExpired && (
          <span css={errorInfoStyle}>
            {t("homepage.tipi_chat.message.file_expired")}
          </span>
        )}
      </span>
    </div>
  )
}

export default FileContent
