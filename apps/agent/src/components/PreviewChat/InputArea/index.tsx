import { lazy, memo } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { IInputAreaProps } from "./interface"

const MobileInputArea = lazy(() => import("./mobile"))
const DesktopInputArea = lazy(() => import("./pc"))

const InputArea = memo((props: IInputAreaProps) => {
  const { isReceiving, hasMessage, onSendMessage } = props
  return (
    <LayoutAutoChange
      desktopPage={
        <DesktopInputArea
          isReceiving={isReceiving}
          onSendMessage={onSendMessage}
          hasMessage={hasMessage}
        />
      }
      mobilePage={
        <MobileInputArea
          isReceiving={isReceiving}
          onSendMessage={onSendMessage}
          hasMessage={hasMessage}
        />
      }
    />
  )
})

InputArea.displayName = "InputArea"

export default InputArea
