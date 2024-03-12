import { App } from "antd"
import {
  FC,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import WebSocketClient from "@illa-public/illa-web-socket"
import { isPremiumModel } from "@illa-public/market-agent"
import { AI_AGENT_TYPE, Agent } from "@illa-public/public-types"
import {
  CollarModalType,
  handleCollaPurchaseError,
  useCollarModal,
} from "@illa-public/upgrade-modal"
import { getCurrentTeamInfo, getCurrentUser } from "@illa-public/user-data"
import { getAuthToken } from "@illa-public/utils"
import { getTextMessagePayload } from "@/api/ws"
import { Callback, ILLA_WEBSOCKET_STATUS } from "@/api/ws/interface"
import { TextSignal, TextTarget } from "@/api/ws/textSignal"
import {
  useLazyGetAIAgentAnonymousAddressQuery,
  useLazyGetAIAgentWsAddressQuery,
} from "@/redux/services/agentAPI"
import {
  ChatMessage,
  ChatSendRequestPayload,
  ChatWsAppendResponse,
  CollaboratorsInfo,
} from "../../components/PreviewChat/interface"
import {
  AgentMessageType,
  IInitWSCallback,
  TipisWebSocketContextType,
  TipisWebSocketProviderProps,
} from "./interface"
import { formatMessageString } from "./utils"

export const TipisWebSocketContext = createContext<TipisWebSocketContextType>(
  {} as TipisWebSocketContextType,
)

export const TipisWebSocketProvider: FC<TipisWebSocketProviderProps> = (
  props,
) => {
  const { children } = props

  const { message: messageAPI } = App.useApp()
  const { t } = useTranslation()

  const tipisWSClient = useRef<WebSocketClient | null>(null)

  const [wsStatus, setWSStatus] = useState<ILLA_WEBSOCKET_STATUS>(
    ILLA_WEBSOCKET_STATUS.INIT,
  )
  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const currentUserInfo = useSelector(getCurrentUser)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [generationMessage, setGenerationMessage] = useState<
    ChatMessage | undefined
  >(undefined)

  const chatMessagesRef = useRef<ChatMessage[]>([])
  const generationMessageRef = useRef<ChatMessage | undefined>(undefined)
  const collaModal = useCollarModal()

  const [triggerGetAIAgentAnonymousAddressQuery] =
    useLazyGetAIAgentAnonymousAddressQuery()
  const [triggerGetAIAgentWsAddressQuery] = useLazyGetAIAgentWsAddressQuery()

  const sendMessage = useCallback(
    (
      payload: ChatSendRequestPayload,
      signal: TextSignal,
      aiAgentType: AI_AGENT_TYPE,
      type: AgentMessageType,
      updateMessage?: boolean,
      messageContent?: ChatMessage,
    ) => {
      // onReceiving(true)
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

      tipisWSClient.current?.sendMessage(
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
    [chatMessages, currentTeamInfo?.id, currentUserInfo.userID, tipisWSClient],
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

  const leaveRoom = useCallback(() => {
    cleanMessage()
    tipisWSClient.current?.sendMessage(
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
    tipisWSClient.current?.close()
    tipisWSClient.current = null
  }, [cleanMessage, currentTeamInfo, tipisWSClient])

  const connect = useCallback(
    async (agentInfo: Agent, callbackOptions: IInitWSCallback) => {
      let address = ""
      const { aiAgentID, agentType } = agentInfo
      const {
        onReceiving,
        onConnecting,
        onRunning,
        onStartRunning,
        onUpdateRoomUsers,
      } = callbackOptions
      onConnecting(true)
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
      } catch (e) {
        onConnecting(false)
        const res = handleCollaPurchaseError(
          e,
          CollarModalType.TOKEN,
          "agent_run",
        )
        if (res) return
        messageAPI.error({
          content: t("editor.ai-agent.message.start-failed"),
        })
        return
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
                sendMessage(
                  {} as ChatSendRequestPayload,
                  TextSignal.CLEAN,
                  agentType,
                  "clean",
                  false,
                )

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
                const partAgentInfo = {
                  prompt: agentInfo.prompt,
                  actionID: agentInfo.aiAgentID,
                  modelConfig: agentInfo.modelConfig,
                  model: agentInfo.model,
                  agentType: agentInfo.agentType,
                }
                sendMessage(
                  {
                    ...partAgentInfo,
                    threadID: v4(),
                  } as ChatSendRequestPayload,
                  TextSignal.RUN,
                  agentType,
                  "chat",
                  false,
                )
                break
            }
          } else {
            switch (callback.errorCode) {
              case 1:
                onReceiving(false)
                onRunning(false)
                messageAPI.error({
                  content: t("editor.ai-agent.message.start-failed"),
                })
                break
              case 15:
                onReceiving(false)
                break
              case 16:
                messageAPI.error({
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
      tipisWSClient.current = webSocketClient
      onConnecting(false)
      onRunning(true)
      onReceiving(true)
      onStartRunning()
    },
    [
      cleanMessage,
      collaModal,
      currentTeamInfo,
      messageAPI,
      onUpdateChatMessage,
      onUpdateGenerationMessage,
      sendMessage,
      t,
      triggerGetAIAgentAnonymousAddressQuery,
      triggerGetAIAgentWsAddressQuery,
    ],
  )

  const reconnect = useCallback(
    async (aiAgentInfo: Agent, initWSCallback: IInitWSCallback) => {
      const { onRunning } = initWSCallback
      leaveRoom()
      onRunning(false)
      chatMessagesRef.current = []
      setChatMessages([])
      generationMessageRef.current = undefined
      setGenerationMessage(undefined)
      await connect(aiAgentInfo, initWSCallback)
    },
    [connect, leaveRoom],
  )

  const value = useMemo(
    () => ({
      connect,
      reconnect,
      sendMessage,
      leaveRoom,
      generationMessage,
      chatMessages,
      wsStatus,
    }),
    [
      chatMessages,
      connect,
      generationMessage,
      leaveRoom,
      reconnect,
      sendMessage,
      wsStatus,
    ],
  )

  return (
    <TipisWebSocketContext.Provider value={value}>
      {children}
    </TipisWebSocketContext.Provider>
  )
}
