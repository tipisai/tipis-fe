import { FC, UIEvent, useCallback, useEffect, useRef } from "react"
import { TipisTrack } from "@illa-public/track-utils"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { TextSignal } from "@/api/ws/textSignal"
import BlockInputTip from "./BlockInputTip"
import GeneratingBlock from "./GeneratingBlock"
import InputArea from "./InputArea"
import MessageList from "./MessageList"
import { SEND_MESSAGE_WS_TYPE } from "./TipisWebscoketContext/interface"
import { SCROLL_DIRECTION } from "./constants"
import { ChatSendRequestPayload, PreviewChatProps } from "./interface"
import {
  inputTextContainerStyle,
  maxWidthStyle,
  previewChatContainerStyle,
} from "./style"

export const PreviewChat: FC<PreviewChatProps> = (props) => {
  const { blockInput, editState, onSendMessage, wsContextValue } = props

  const { chatMessages, isReceiving, sendMessage } = wsContextValue

  const { data: currentUserInfo } = useGetUserInfoQuery(null)

  const chatRef = useRef<HTMLDivElement>(null)

  const scrollDirectRef = useRef<SCROLL_DIRECTION>(SCROLL_DIRECTION.DOWN)
  const cacheLastScroll = useRef<number>(0)
  const cacheMessageLength = useRef(chatMessages.length)

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

  useEffect(() => {
    if (chatMessages.length === 0) {
      scrollDirectRef.current = SCROLL_DIRECTION.DOWN
    }
    if (scrollDirectRef.current === SCROLL_DIRECTION.DOWN) {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
      })
    } else {
      if (cacheMessageLength.current !== chatMessages.length) {
        scrollDirectRef.current = SCROLL_DIRECTION.DOWN
      }
    }
    cacheMessageLength.current = chatMessages.length
  }, [chatMessages.length])

  return (
    <div css={previewChatContainerStyle}>
      <MessageList
        ref={chatRef}
        handleScroll={handleScroll}
        chatMessages={chatMessages}
        isReceiving={isReceiving}
        currentUserID={currentUserInfo?.userID ?? ""}
      />
      <div css={[inputTextContainerStyle, maxWidthStyle]}>
        {blockInput ? (
          <BlockInputTip editState={editState} />
        ) : (
          <>
            <GeneratingBlock
              isReceiving={isReceiving}
              handleClickStop={handleClickStopGenerating}
            />
            <InputArea
              isReceiving={isReceiving}
              onSendMessage={onSendMessage}
            />
          </>
        )}
      </div>
    </div>
  )
}
