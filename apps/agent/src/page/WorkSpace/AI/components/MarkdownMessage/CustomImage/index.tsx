import Icon from "@ant-design/icons"
import { App, Button, Image, ImageProps, Tooltip } from "antd"
import { FC } from "react"
import { DownloadIcon } from "@illa-public/icon"
import { handleDownloadFiles } from "@/utils/drive/download"
import { MarkdownMessageProps } from "../interface"
import { downloadIconStyle, imageContainerStyle } from "./style"

const CustomImage: FC<
  ImageProps & Pick<MarkdownMessageProps, "isOwnMessage">
> = ({ alt, src, isOwnMessage }) => {
  const { message } = App.useApp()
  const URL = new URLSearchParams(src)
  const fileName = URL.get("fileName")

  const handleDownload = () => {
    if (!src) {
      return
    }
    if (!fileName) {
      message.error("_error")
      return
    }
    const fileInfo = {
      name: fileName,
      downloadURL: src,
    }
    handleDownloadFiles([fileInfo])
  }
  const contentBody = (
    <div css={imageContainerStyle}>
      <Image src={src} alt={alt} preview={false} width="100%" />
    </div>
  )
  return isOwnMessage || !fileName ? (
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
