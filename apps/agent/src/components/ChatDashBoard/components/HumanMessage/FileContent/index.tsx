import { FC } from "react"
import { useTranslation } from "react-i18next"
import { getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE } from "@illa-public/public-types"
import { IMessageFileVO } from "@/components/ChatDashBoard/interface"
import {
  errorInfoStyle,
  fileInfoStyle,
  fileItemStyle,
  fileNameStyle,
  fileTypeIconStyle,
  iconContainerStyle,
} from "./style"

interface IFileContentProps
  extends Pick<IMessageFileVO, "content_type" | "file_name"> {
  isExpired?: boolean
}

const FileContent: FC<IFileContentProps> = ({
  content_type,
  file_name,
  isExpired,
}) => {
  const { t } = useTranslation()
  return (
    <div css={fileItemStyle}>
      <span css={iconContainerStyle}>
        {getFileIconByContentType(
          GCS_OBJECT_TYPE.FILE,
          content_type,
          fileTypeIconStyle,
        )}
      </span>
      <span css={fileInfoStyle}>
        <span css={fileNameStyle}>{file_name}</span>
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
