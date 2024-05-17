import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { FC, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { DownloadIcon, getFileIconByContentType } from "@illa-public/icon"
import { GCS_OBJECT_TYPE } from "@illa-public/public-types"
import { handleCreditPurchaseError } from "@illa-public/upgrade-modal"
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
  const [disabled, setDisabled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleDownload = (downloadURL: string, fileName: string) => {
    if (!downloadURL || !fileName) {
      return
    }
    setDisabled(true)
    const fileInfo = {
      name: fileName,
      downloadURL: downloadURL,
    }
    handleDownloadFiles([fileInfo])
      .catch((e) => {
        if (!handleCreditPurchaseError(e)) {
          setIsExpired(true)
        }
      })
      .finally(() => {
        setDisabled(false)
      })
  }
  const contentBody = (
    <div css={fileCardContainerStyle} ref={containerRef}>
      {getFileIconByContentType(
        GCS_OBJECT_TYPE.FILE,
        contentType,
        fileTypeIconStyle,
      )}
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
          disabled={disabled}
          size="small"
        />
      }
      placement="right"
      align={{
        offset: [-40, 4],
      }}
      getTooltipContainer={() => containerRef.current!}
    >
      {contentBody}
    </Tooltip>
  )
}

export default FileContent
