import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { ClearIcon } from "@illa-public/icon"
import { iconStyle } from "./style"

const MobileClearButton: FC = () => {
  return (
    <Button
      size="large"
      type="text"
      icon={<Icon component={ClearIcon} css={iconStyle} />}
    />
  )
}

export default MobileClearButton
