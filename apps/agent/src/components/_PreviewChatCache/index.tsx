import { FC, UIEvent, useCallback, useEffect, useRef } from "react"
import { TipisTrack } from "@illa-public/track-utils"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { TextSignal } from "@/api/ws/textSignal"
import { SEND_MESSAGE_WS_TYPE } from "./TipisWebscoketContext/interface"
import BlockInputTip from "./components/BlockInputTip"
import GeneratingBlock from "./components/GeneratingBlock"
import InputArea from "./components/InputArea"
import MessageList from "./components/MessageList"
import { SCROLL_DIRECTION } from "./constants"
import {
  ChatMessage,
  ChatSendRequestPayload,
  PreviewChatProps,
} from "./interface"
import {
  inputTextContainerStyle,
  maxWidthStyle,
  previewChatContainerStyle,
} from "./style"

export const PreviewChat: FC<PreviewChatProps> = (props) => {
  const { blockInput, onSendMessage, wsContextValue } = props

  const { chatMessages, isReceiving, sendMessage, currentRenderMessage } =
    wsContextValue

  const { data: currentUserInfo } = useGetUserInfoQuery(null)

  const chatRef = useRef<HTMLDivElement>(null)

  const scrollDirectRef = useRef<SCROLL_DIRECTION>(SCROLL_DIRECTION.DOWN)
  const cacheLastScroll = useRef<number>(0)

  const handleClickStopGenerating = useCallback(() => {
    TipisTrack.track("click_stop_generate")
    sendMessage(
      {} as ChatSendRequestPayload,
      TextSignal.STOP_RUN,
      SEND_MESSAGE_WS_TYPE.STOP_ALL,
    )
  }, [sendMessage])

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < cacheLastScroll.current) {
      scrollDirectRef.current = SCROLL_DIRECTION.UP
    }
    cacheLastScroll.current = e.currentTarget.scrollTop
  }, [])

  const handleSendMessage = (cheatMessage: ChatMessage) => {
    scrollDirectRef.current = SCROLL_DIRECTION.DOWN
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
    })
    onSendMessage(cheatMessage)
  }

  useEffect(() => {
    if (
      !!currentRenderMessage &&
      scrollDirectRef.current === SCROLL_DIRECTION.DOWN
    ) {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
      })
    }
  }, [currentRenderMessage])

  return (
    <div css={previewChatContainerStyle}>
      <MessageList
        ref={chatRef}
        handleScroll={handleScroll}
        chatMessages={chatMessages}
        isReceiving={isReceiving}
        currentUserID={currentUserInfo?.id ?? ""}
        currentRenderMessage={currentRenderMessage}
      />
      <div css={[inputTextContainerStyle, maxWidthStyle]}>
        {blockInput ? (
          <BlockInputTip />
        ) : (
          <>
            <GeneratingBlock
              isReceiving={isReceiving}
              handleClickStop={handleClickStopGenerating}
            />
            <InputArea
              isReceiving={isReceiving}
              onSendMessage={handleSendMessage}
              hasMessage={chatMessages.length > 0}
            />
          </>
        )}
      </div>
    </div>
  )
}
