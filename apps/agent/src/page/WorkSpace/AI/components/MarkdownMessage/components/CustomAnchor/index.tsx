import { Typography } from "antd"
import { FC, ReactNode } from "react"
import { tipisStorageURLHelper } from "../../utils"
import CustomImage from "../CustomImage"
import { FileMessageCard } from "../FileCard"

interface ICustomAnchorProps {
  href?: string
  children?: ReactNode[]
}

const CustomAnchor: FC<ICustomAnchorProps> = ({ href, children }) => {
  const { fileName, isTipisStorageURL, contentType } =
    tipisStorageURLHelper(href)
  if (isTipisStorageURL && fileName && contentType && href) {
    if (contentType?.startsWith("image/")) {
      return <CustomImage src={href} />
    }
    return (
      <FileMessageCard
        fileName={fileName}
        contentType={contentType}
        downloadURL={href}
      />
    )
  }
  return (
    <Typography.Link href={href} target="_blank">
      {children}
    </Typography.Link>
  )
}

export default CustomAnchor
