import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { ChatStableWSContext, ChatUnStableWSContext } from "../../../context"
import { iconStyle } from "./style"

const MobileStartButton: FC = () => {
  const { isConnecting, isRunning } = useContext(ChatUnStableWSContext)
  const { reconnect, connect } = useContext(ChatStableWSContext)

  return (
    <Button
      size="large"
      type="text"
      loading={isConnecting}
      onClick={isRunning ? reconnect : connect}
      icon={
        isRunning ? (
          <Icon component={ResetIcon} css={iconStyle} />
        ) : (
          <Icon component={PlayFillIcon} css={iconStyle} />
        )
      }
    />
  )
}

export default MobileStartButton
