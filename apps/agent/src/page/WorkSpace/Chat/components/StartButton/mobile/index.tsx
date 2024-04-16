import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC, useContext } from "react"
import { PlayFillIcon, ResetIcon } from "@illa-public/icon"
import { WS_READYSTATE } from "@illa-public/illa-web-socket"
import { ChatStableWSContext, ChatUnStableWSContext } from "../../../context"
import { iconStyle } from "./style"

const MobileStartButton: FC = () => {
  const { isConnecting, isRunning, chatMessages, getReadyState } = useContext(
    ChatUnStableWSContext,
  )
  const { reconnect, connect } = useContext(ChatStableWSContext)

  const disabledClick =
    chatMessages.length === 0 ||
    (isRunning &&
      getReadyState() !== WS_READYSTATE.CONNECTING &&
      getReadyState() !== WS_READYSTATE.OPEN)

  return (
    <Button
      size="large"
      type="text"
      disabled={disabledClick}
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
