import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { DownloadIcon, getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE } from "@illa-public/public-types"
import { handleDownloadFiles } from "@/utils/drive/download"
import { IFileContentProps } from "./interface"
import {
  errorInfoStyle,
  fileCardContainerStyle,
  fileInfoStyle,
  fileNameStyle,
  fileTypeIconStyle,
} from "./style"

const FileContent: FC<IFileContentProps> = ({
  contentType,
  fileName,
  downloadURL,
}) => {
  const { t } = useTranslation()
  const [isExpired, setIsExpired] = useState(false)
  const handleDownload = (downloadURL: string, fileName: string) => {
    if (!downloadURL || !fileName) {
      return
    }
    const fileInfo = {
      name: fileName,
      downloadURL: downloadURL,
    }
    handleDownloadFiles([fileInfo]).catch((e) => {
      console.log("download", e)
      setIsExpired(true)
    })
  }
  const contentBody = (
    <div css={fileCardContainerStyle}>
      {getFileIconByContentType(
        GCS_OBJECT_TYPE.FILE,
        contentType,
        fileTypeIconStyle,
      )}
      <span css={fileInfoStyle}>
        <span css={fileNameStyle}>{fileName}</span>
        {isExpired && (
          <span css={errorInfoStyle}>{t("The document has expired.")}</span>
        )}
      </span>
    </div>
  )
  return !downloadURL || !fileName || isExpired ? (
    contentBody
  ) : (
    <Tooltip
      color="transparent"
      overlayInnerStyle={{
        padding: 0,
        height: 24,
        width: 24,
        boxShadow: "none",
      }}
      title={
        <Button
          icon={<Icon component={DownloadIcon} />}
          onClick={() => handleDownload(downloadURL, fileName)}
          size="small"
        />
      }
    >
      {contentBody}
    </Tooltip>
  )
}

export default FileContent
