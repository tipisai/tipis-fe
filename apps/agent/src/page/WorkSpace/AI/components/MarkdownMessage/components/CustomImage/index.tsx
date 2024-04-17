import Icon from "@ant-design/icons"
import { Button, Image, ImageProps, Tooltip } from "antd"
import { FC, useState } from "react"
import { DownloadIcon } from "@illa-public/icon"
import { handleCreditPurchaseError } from "@illa-public/upgrade-modal"
import imageLoadErrSrc from "@/assets/agent/imageLoadErr.svg"
import { handleDownloadFiles } from "@/utils/drive/download"
import { tipisStorageURLHelper } from "../../utils"
import { downloadIconStyle, imageContainerStyle, imageStyle } from "./style"

const CustomImage: FC<ImageProps> = ({ alt, src }) => {
  const { fileName, isTipisStorageURL } = tipisStorageURLHelper(src)
  const [isExpired, setIsExpired] = useState(false)

  const handleDownload = () => {
    if (!src) {
      return
    }
    if (!fileName) {
      return
    }
    const fileInfo = {
      name: fileName,
      downloadURL: src,
    }
    handleDownloadFiles([fileInfo]).catch((e) => {
      if (!handleCreditPurchaseError(e)) {
        setIsExpired(true)
      }
    })
  }
  const contentBody = (
    <div css={imageContainerStyle}>
      <Image
        src={src}
        alt={alt}
        preview={false}
        width="100%"
        style={imageStyle(isExpired)}
        fallback={imageLoadErrSrc}
        placeholder={
          <Image
            preview={false}
            src={imageLoadErrSrc}
            width={120}
            height={120}
            style={{
              borderRadius: "8px",
            }}
          />
        }
        onError={() => setIsExpired(true)}
      />
    </div>
  )
  return !isTipisStorageURL || isExpired ? (
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
          icon={<Icon component={DownloadIcon} css={downloadIconStyle} />}
          onClick={handleDownload}
          size="small"
        />
      }
      align={{
        offset: [-32, 0],
      }}
      placement="rightBottom"
    >
      {contentBody}
    </Tooltip>
  )
}

export default CustomImage
