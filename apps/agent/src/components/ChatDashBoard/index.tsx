import { FC, UIEvent, useCallback, useContext, useRef } from "react"
import InputArea from "./components/InputArea"
import MessageList from "./components/MessageList"
import { SCROLL_DIRECTION } from "./constants"
import { ChatStableWSContext, ChatUnStableWSContext } from "./context"
import { IHumanMessageDTO } from "./interface"
import {
  inputTextContainerStyle,
  maxWidthStyle,
  previewChatContainerStyle,
} from "./style"

export const PreviewChat: FC = () => {
  const chatRef = useRef<HTMLDivElement>(null)
  const { handleSendMessage } = useContext(ChatStableWSContext)
  const { cycleMessageList, currentRenderCycle } = useContext(
    ChatUnStableWSContext,
  )
  const scrollDirectRef = useRef<SCROLL_DIRECTION>(SCROLL_DIRECTION.DOWN)
  const cacheLastScroll = useRef<number>(0)

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < cacheLastScroll.current) {
      scrollDirectRef.current = SCROLL_DIRECTION.UP
    }
    cacheLastScroll.current = e.currentTarget.scrollTop
  }, [])

  const sendMessage = (cheatMessage: IHumanMessageDTO) => {
    scrollDirectRef.current = SCROLL_DIRECTION.DOWN
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
    })
    handleSendMessage(cheatMessage)
  }

  // useEffect(() => {
  //   if (
  //     !!currentRenderMessage &&
  //     scrollDirectRef.current === SCROLL_DIRECTION.DOWN
  //   ) {
  //     chatRef.current?.scrollTo({
  //       top: chatRef.current.scrollHeight,
  //     })
  //   }
  // }, [currentRenderMessage])

  return (
    <div css={previewChatContainerStyle}>
      <MessageList
        ref={chatRef}
        handleScroll={handleScroll}
        cycleMessageList={cycleMessageList}
        currentRenderCycle={currentRenderCycle}
      />
      <div css={[inputTextContainerStyle, maxWidthStyle]}>
        <InputArea sendMessage={sendMessage} />
      </div>
    </div>
  )
}
