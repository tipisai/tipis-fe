import WebSocketClient from "@illa-public/illa-web-socket"
import { isPremiumModel } from "@illa-public/market-agent"
import { AI_AGENT_TYPE } from "@illa-public/public-types"
import {
  CollarModalType,
  handleCollaPurchaseError,
  useCollarModal,
} from "@illa-public/upgrade-modal"
import { getCurrentTeamInfo, getCurrentUser } from "@illa-public/user-data"
import { getAuthToken } from "@illa-public/utils"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useMessage } from "@illa-design/react"
import { getTextMessagePayload } from "@/api/ws"
import { Callback, ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal, TextTarget } from "@/api/ws/textSignal"
import {
  ChatMessage,
  ChatSendRequestPayload,
  ChatWsAppendResponse,
  CollaboratorsInfo,
} from "@/page/AI/components/PreviewChat/interface"
import {
  UseAgentProps,
  UseAgentReturn,
} from "@/page/AI/components/ws/useAgentProps"
import {
  useLazyGetAIAgentAnonymousAddressQuery,
  useLazyGetAIAgentWsAddressQuery,
} from "@/redux/services/agentAPI"
import { formatMessageString } from "./utils"

export type AgentMessageType = "chat" | "stop_all" | "clean"

export function useAgentConnect(useAgentProps: UseAgentProps) {
  const {
    onConnecting,
    onReceiving,
    onSendClean,
    onUpdateRoomUsers,
    onRunning,
    onSendPrompt,
    onStartRunning,
  } = useAgentProps

  const [triggerGetAIAgentAnonymousAddressQuery] =
    useLazyGetAIAgentAnonymousAddressQuery()
  const [triggerGetAIAgentWsAddressQuery] = useLazyGetAIAgentWsAddressQuery()

  const wsClientRef = useRef<WebSocketClient | null>(null)
  const [wsStatus, setWSStatus] = useState<ILLA_WEBSOCKET_STATUS>(
    ILLA_WEBSOCKET_STATUS.INIT,
  )
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [generationMessage, setGenerationMessage] = useState<
    ChatMessage | undefined
  >(undefined)

  const chatMessagesRef = useRef<ChatMessage[]>([])
  const generationMessageRef = useRef<ChatMessage | undefined>(undefined)

  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const currentUserInfo = useSelector(getCurrentUser)

  const message = useMessage()
  const collaModal = useCollarModal()
  const { t } = useTranslation()

  const sendMessage = useCallback(
    (
      payload: ChatSendRequestPayload,
      signal: TextSignal,
      aiAgentType: AI_AGENT_TYPE,
      type: AgentMessageType,
      updateMessage?: boolean,
      messageContent?: ChatMessage,
    ) => {
      onReceiving(true)
      const encodePayload: ChatSendRequestPayload = payload
      Object.keys(encodePayload).forEach((key) => {
        if (key === "prompt") {
          const text = encodePayload[key]
          if (isPremiumModel(payload.model)) {
            encodePayload[key] = encodeURIComponent(
              formatMessageString(text, messageContent?.knowledgeFiles),
            )
          } else {
            encodePayload[key] = encodeURIComponent(encodePayload[key])
          }
        }
        if (key === "variables") {
          encodePayload[key] = encodePayload[key].map((v) => {
            return {
              ...v,
              value: encodeURIComponent(v.value),
            }
          })
        }
      })

      wsClientRef.current?.sendMessage(
        getTextMessagePayload(
          signal,
          TextTarget.ACTION,
          true,
          {
            type: type,
            payload: {},
          },
          currentTeamInfo?.id ?? "",
          currentUserInfo.userID,
          [encodePayload],
        ),
      )

      if (updateMessage && messageContent) {
        switch (aiAgentType) {
          case AI_AGENT_TYPE.CHAT:
            chatMessagesRef.current = [
              ...chatMessagesRef.current,
              messageContent,
            ]
            setChatMessages([...chatMessages, messageContent])
            break
          case AI_AGENT_TYPE.TEXT_GENERATION:
            break
        }
      }
    },
    [chatMessages, currentTeamInfo?.id, currentUserInfo.userID, onReceiving],
  )

  const onUpdateChatMessage = useCallback((message: ChatMessage) => {
    const newMessageList = [...chatMessagesRef.current]
    const index = newMessageList.findIndex((m) => {
      return m.threadID === message.threadID
    })
    if (index === -1) {
      newMessageList.push({
        sender: message.sender,
        message: message.message,
        threadID: message.threadID,
      } as ChatMessage)
    } else {
      newMessageList[index].message =
        newMessageList[index].message + message.message
    }
    chatMessagesRef.current = newMessageList
    setChatMessages(newMessageList)
  }, [])

  const onUpdateGenerationMessage = useCallback((message: ChatMessage) => {
    if (
      generationMessageRef.current &&
      generationMessageRef.current.threadID === message.threadID
    ) {
      const newMessage = {
        ...generationMessageRef.current,
      }
      newMessage.message = newMessage.message + message.message
      generationMessageRef.current = newMessage
      setGenerationMessage(newMessage)
    } else {
      const m = {
        sender: message.sender,
        message: message.message,
        threadID: message.threadID,
      } as ChatMessage
      generationMessageRef.current = m
      setGenerationMessage(m)
    }
  }, [])

  const cleanMessage = useCallback(() => {
    chatMessagesRef.current = []
    setChatMessages([])
    generationMessageRef.current = undefined
    setGenerationMessage(undefined)
  }, [])

  const connect = useCallback(
    async (aiAgentID: string, agentType: AI_AGENT_TYPE) => {
      onConnecting(true)
      setWSStatus(ILLA_WEBSOCKET_STATUS.CONNECTING)
      let address = ""
      try {
        if (aiAgentID === "" || aiAgentID === undefined) {
          const { aiAgentConnectionAddress } =
            await triggerGetAIAgentAnonymousAddressQuery(
              currentTeamInfo!.id,
            ).unwrap()

          address = aiAgentConnectionAddress
        } else {
          const { aiAgentConnectionAddress } =
            await triggerGetAIAgentWsAddressQuery({
              teamID: currentTeamInfo!.id,
              aiAgentID: aiAgentID,
            }).unwrap()

          address = aiAgentConnectionAddress
        }

        const webSocketClient = new WebSocketClient(address, {
          onOpen: () => {
            webSocketClient.sendMessage(
              getTextMessagePayload(
                TextSignal.ENTER,
                TextTarget.NOTHING,
                false,
                {
                  type: "enter",
                  payload: [],
                },
                currentTeamInfo!.id,
                "",
                [
                  {
                    authToken: getAuthToken(),
                  },
                ],
              ),
            )
            setWSStatus(ILLA_WEBSOCKET_STATUS.CONNECTED)
          },
          onClose: () => {
            setWSStatus(ILLA_WEBSOCKET_STATUS.CLOSED)
            onReceiving(true)
          },
          onError: () => {
            setWSStatus(ILLA_WEBSOCKET_STATUS.FAILED)
          },
          onMessage: (data) => {
            let callback: Callback<unknown> = JSON.parse(data)
            if (callback.errorCode === 0) {
              switch (callback.broadcast?.type) {
                case "enter/remote":
                  const { inRoomUsers } = callback.broadcast.payload as {
                    inRoomUsers: CollaboratorsInfo[]
                  }
                  onUpdateRoomUsers(inRoomUsers)
                  cleanMessage()
                  onSendClean()
                  break
                case "chat/remote":
                  let chatCallback = callback.broadcast
                    .payload as ChatWsAppendResponse
                  if (agentType === AI_AGENT_TYPE.CHAT) {
                    onUpdateChatMessage(chatCallback)
                  } else {
                    onUpdateGenerationMessage(chatCallback)
                  }
                  break
                case "stop_all/remote":
                  break
                case "clean/remote":
                  onSendPrompt()
                  break
              }
            } else {
              switch (callback.errorCode) {
                case 1:
                  onReceiving(false)
                  onRunning(false)
                  message.error({
                    content: t("editor.ai-agent.message.start-failed"),
                  })
                  break
                case 15:
                  onReceiving(false)
                  break
                case 16:
                  message.error({
                    content: t("editor.ai-agent.message.token"),
                  })
                  break
                case 17:
                case 18:
                  collaModal({
                    modalType: CollarModalType.TOKEN,
                    from: "agent_run",
                  })
                  break
                case 3:
                  break
              }
            }
          },
        })
        wsClientRef.current = webSocketClient
        onConnecting(false)
        onRunning(true)
        onReceiving(true)
        onStartRunning()
      } catch (e) {
        onConnecting(false)
        const res = handleCollaPurchaseError(
          e,
          CollarModalType.TOKEN,
          "agent_run",
        )
        if (res) return
        message.error({
          content: t("editor.ai-agent.message.start-failed"),
        })
        return
      }
    },
    [
      onConnecting,
      onRunning,
      onReceiving,
      onStartRunning,
      triggerGetAIAgentAnonymousAddressQuery,
      currentTeamInfo,
      triggerGetAIAgentWsAddressQuery,
      onUpdateRoomUsers,
      cleanMessage,
      onSendClean,
      onSendPrompt,
      onUpdateChatMessage,
      onUpdateGenerationMessage,
      message,
      t,
      collaModal,
    ],
  )

  const leaveRoom = useCallback(() => {
    wsClientRef.current?.sendMessage(
      getTextMessagePayload(
        TextSignal.LEAVE,
        TextTarget.NOTHING,
        false,
        {
          type: "leave",
          payload: [],
        },
        currentTeamInfo!.id,
        "",
        [],
      ),
    )
    wsClientRef.current?.close()
    wsClientRef.current = null
  }, [currentTeamInfo])

  useEffect(() => {
    window.addEventListener("beforeunload", leaveRoom)
    return () => {
      window.removeEventListener("beforeunload", leaveRoom)
    }
  }, [leaveRoom])

  const reconnect = useCallback(
    async (aiAgentID: string, aiAgentType: AI_AGENT_TYPE) => {
      leaveRoom()
      onRunning(false)
      chatMessagesRef.current = []
      setChatMessages([])
      generationMessageRef.current = undefined
      setGenerationMessage(undefined)
      await connect(aiAgentID, aiAgentType)
    },
    [connect, leaveRoom, onRunning],
  )

  return {
    connect,
    reconnect,
    chatMessages,
    generationMessage,
    sendMessage,
    wsStatus,
  } as UseAgentReturn
}
