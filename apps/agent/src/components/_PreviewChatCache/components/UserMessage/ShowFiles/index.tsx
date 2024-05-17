import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import { FC, useRef, useState } from "react"
import { DownloadIcon } from "@illa-public/icon"
import { IKnowledgeFile } from "@illa-public/public-types"
import { handleCreditPurchaseError } from "@illa-public/upgrade-modal"
import { handleDownloadFiles } from "@/utils/drive/download"
import FileContent from "../FileContent"
import { containerStyle, fileContainerStyle } from "./style"

interface ShowFilesProps {
  knowledgeFiles: IKnowledgeFile[]
}

const SingleFile: FC<
  Pick<IKnowledgeFile, "downloadURL" | "fileName" | "contentType">
> = ({ downloadURL, fileName, contentType }) => {
  const [isExpired, setIsExpired] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleDownload = (fileName: string, downloadURL: string) => {
    if (!downloadURL || !fileName) {
      return
    }
    const fileInfo = {
      name: fileName,
      downloadURL: downloadURL,
    }
    setDisabled(true)
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

  return isExpired ? (
    <FileContent contentType={contentType} fileName={fileName} isExpired />
  ) : (
    <Tooltip
      key={fileName}
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
          disabled={disabled}
          onClick={() => handleDownload(fileName, downloadURL!)}
          size="small"
        />
      }
      align={{
        offset: [-40, 4],
      }}
      placement="right"
      getTooltipContainer={() => containerRef.current!}
    >
      <div css={fileContainerStyle} ref={containerRef}>
        <FileContent contentType={contentType} fileName={fileName} />
      </div>
    </Tooltip>
  )
}
const ShowFiles: FC<ShowFilesProps> = ({ knowledgeFiles }) => {
  return (
    <div css={containerStyle}>
      {knowledgeFiles.map((item) =>
        item.fileName && item.downloadURL ? (
          <SingleFile
            key={item.fileName}
            contentType={item.contentType}
            fileName={item.fileName}
            downloadURL={item.downloadURL}
          />
        ) : (
          <FileContent
            key={item.fileName}
            contentType={item.contentType}
            fileName={item.fileName}
          />
        ),
      )}
    </div>
  )
}

export default ShowFiles