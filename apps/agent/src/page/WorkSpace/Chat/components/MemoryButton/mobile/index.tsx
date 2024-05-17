import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { MemoryIcon } from "@illa-public/icon"
import { iconStyle } from "./style"

const MobileStartButton: FC = () => {
  return (
    <Button
      size="large"
      type="text"
      icon={<Icon component={MemoryIcon} css={iconStyle} />}
    />
  )
}

export default MobileStartButton
