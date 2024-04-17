import Icon from "@ant-design/icons"
import { Button, Image, ImageProps, Skeleton, Tooltip } from "antd"
import { FC, useState } from "react"
import { DownloadIcon } from "@illa-public/icon"
import { handleCreditPurchaseError } from "@illa-public/upgrade-modal"
import imageLoadErrSrc from "@/assets/agent/imageLoadErr.svg"
import ImageLoadingIcon from "@/assets/agent/message-image-loading.svg?react"
import { handleDownloadFiles } from "@/utils/drive/download"
import { tipisStorageURLHelper } from "../../utils"
import { downloadIconStyle, imageContainerStyle, imageStyle } from "./style"

const CustomImage: FC<ImageProps> = ({ alt, src }) => {
  const { fileName, isTipisStorageURL } = tipisStorageURLHelper(src)
  const [isExpired, setIsExpired] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const handleDownload = () => {
    if (!src) {
      return
    }
    if (!fileName) {
      return
    }
    setDisabled(true)
    const fileInfo = {
      name: fileName,
      downloadURL: src,
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
    <div css={imageContainerStyle}>
      <Image
        src={src}
        alt={alt}
        preview={false}
        width="100%"
        style={imageStyle(isExpired)}
        fallback={imageLoadErrSrc}
        placeholder={
          <Skeleton.Node
            active
            style={{
              width: 120,
              height: 120,
              borderRadius: "8px",
              background:
                "linear-gradient(270deg, #FFF 0%, #F2F3F5 49.83%, #FFF 100%)",
            }}
          >
            <Icon
              component={ImageLoadingIcon}
              style={{ fontSize: 40, color: "#A9AEB8" }}
            />
          </Skeleton.Node>
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
          disabled={disabled}
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
