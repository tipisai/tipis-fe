import { App } from "antd"
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import {
  WooModalType,
  handleWooPurchaseError,
  useCollarModal,
} from "@illa-public/upgrade-modal"
import { getCurrentId } from "@illa-public/user-data"
import { getTextMessagePayload } from "@/api/ws"
import { Callback } from "@/api/ws/interface"
import { TextSignal, TextTarget } from "@/api/ws/textSignal"
import { TipisWebSocketContext } from "@/components/PreviewChat/TipisWebscoketContext"
import {
  AgentMessageType,
  IInitWSCallback,
} from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
  ChatWsAppendResponse,
  CollaboratorsInfo,
  IGroupMessage,
  MESSAGE_STATUS,
  MESSAGE_SYNC_TYPE,
  SenderType,
} from "@/components/PreviewChat/interface"
import { useLazyGetAIAgentAnonymousAddressQuery } from "@/redux/services/agentAPI"
import store from "../../../../redux/store"
import { DEFAULT_PROMO, INIT_CHAT_CONFIG } from "../module/constants"
import {
  IChatStableWSInject,
  IChatUnStableWSInject,
  IChatWSProviderProps,
} from "./interface"
import { isNormalMessage } from "./typeHelper"
import { cancelPendingMessage, formatSendMessagePayload } from "./utils"

export const ChatStableWSContext = createContext({} as IChatStableWSInject)
export const ChatUnStableWSContext = createContext({} as IChatUnStableWSInject)

export const ChatWSProvider: FC<IChatWSProviderProps> = (props) => {
  const { children } = props

  const { message: messageAPI } = App.useApp()

  const { t } = useTranslation()

  const collaModal = useCollarModal()

  const [isConnecting, setIsConnecting] = useState(false)
  const [isReceiving, setIsReceiving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [inRoomUsers, setInRoomUsers] = useState<CollaboratorsInfo[]>([])
  const [chatMessages, setChatMessages] = useState<
    (IGroupMessage | ChatMessage)[]
  >([])
  const chatMessagesRef = useRef<(IGroupMessage | ChatMessage)[]>([])

  const [triggerGetAIAgentAnonymousAddressQuery] =
    useLazyGetAIAgentAnonymousAddressQuery()

  const updateLocalIcon = useCallback(
    (icon: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      let index = updateRoomUsers.findIndex(
        (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
      )
      if (index != -1) {
        updateRoomUsers[index].avatar = icon
      }
      return updateRoomUsers
    },
    [],
  )

  const updateLocalName = useCallback(
    (name: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      let index = updateRoomUsers.findIndex(
        (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
      )
      if (index != -1) {
        updateRoomUsers[index].nickname = name
      }
      return updateRoomUsers
    },
    [],
  )

  const onUpdateRoomUser = useCallback(
    (roomUsers: CollaboratorsInfo[]) => {
      let newRoomUsers = updateLocalIcon("ddddddddd", roomUsers)
      newRoomUsers = updateLocalName("ChatBot", roomUsers)
      setInRoomUsers(newRoomUsers)
    },
    [updateLocalIcon, updateLocalName],
  )

  const onUpdateChatMessage = useCallback((message: ChatMessage) => {
    const newMessageList = [...chatMessagesRef.current]
    const index = newMessageList.findIndex((m) => {
      return m.threadID === message.threadID
    })
    if (index === -1) {
      if (
        message.messageType ===
        MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST
      ) {
        newMessageList.push({
          threadID: message.threadID,
          items: [
            {
              sender: message.sender,
              message: message.message,
              threadID: message.threadID,
              messageType: message.messageType,
              status:
                message.messageType ===
                MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST
                  ? MESSAGE_STATUS.ANALYZE_PENDING
                  : undefined,
            },
          ],
        })
      } else {
        newMessageList.push({
          sender: message.sender,
          message: message.message,
          threadID: message.threadID,
          messageType: message.messageType,
        })
      }
    } else {
      const curMessage = newMessageList[index]
      if (isNormalMessage(curMessage)) {
        curMessage.message = curMessage.message + message.message
      } else {
        const needUpdateMessage = curMessage.items[curMessage.items.length - 1]
        if (needUpdateMessage.messageType === message.messageType) {
          needUpdateMessage.message =
            needUpdateMessage.message + message.message
        } else {
          if (
            message.messageType ===
              MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_ERROR &&
            needUpdateMessage.messageType ===
              MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST
          ) {
            needUpdateMessage.status = MESSAGE_STATUS.ANALYZE_ERROR
          } else if (
            message.messageType ===
              MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_OK &&
            needUpdateMessage.messageType ===
              MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST
          ) {
            needUpdateMessage.status = MESSAGE_STATUS.ANALYZE_SUCCESS
          }
          curMessage.items.push(message)
        }
      }
    }
    chatMessagesRef.current = newMessageList
    setChatMessages(newMessageList)
  }, [])

  const cleanMessage = useCallback(() => {
    chatMessagesRef.current = []
    setChatMessages([])
  }, [])

  const { sendMessage, connect, wsStatus, leaveRoom } = useContext(
    TipisWebSocketContext,
  )

  const innerSendMessage = useCallback(
    (
      payload: ChatSendRequestPayload,
      signal: TextSignal,
      type: AgentMessageType,
      updateMessage?: boolean,
      messageContent?: ChatMessage,
    ) => {
      setIsReceiving(true)

      const encodePayload: ChatSendRequestPayload =
        formatSendMessagePayload(payload)
      const textMessage = getTextMessagePayload(
        signal,
        TextTarget.ACTION,
        true,
        {
          type: type,
          payload: {},
        },
        "",
        "",
        [encodePayload],
      )
      sendMessage(textMessage)

      if (updateMessage && messageContent) {
        chatMessagesRef.current = [...chatMessagesRef.current, messageContent]
        setChatMessages((prevMessage) => [...prevMessage, messageContent])
      }
    },
    [sendMessage],
  )

  const onMessageSuccessCallback = useCallback(
    (callback: Callback<unknown>) => {
      switch (callback.broadcast?.type) {
        case "enter/remote":
          const { inRoomUsers } = callback.broadcast.payload as {
            inRoomUsers: CollaboratorsInfo[]
          }
          onUpdateRoomUser(inRoomUsers)
          cleanMessage()
          innerSendMessage(
            {} as ChatSendRequestPayload,
            TextSignal.CLEAN,
            "clean",
          )

          break
        case "chat/remote":
          let chatCallback = callback.broadcast.payload as ChatWsAppendResponse
          onUpdateChatMessage(chatCallback)
          break
        case "stop_all/remote":
          break
        case "clean/remote":
          const partAgentInfo = {
            prompt: DEFAULT_PROMO,
            actionID: "",
            modelConfig: INIT_CHAT_CONFIG.modelConfig,
            model: INIT_CHAT_CONFIG.model,
            agentType: INIT_CHAT_CONFIG.agentType,
          }
          innerSendMessage(
            {
              ...partAgentInfo,
              threadID: v4(),
            } as ChatSendRequestPayload,
            TextSignal.RUN,
            "chat",
          )

          break
      }
    },
    [cleanMessage, innerSendMessage, onUpdateChatMessage, onUpdateRoomUser],
  )

  const onMessageFailedCallback = useCallback(
    (callback: Callback<unknown>) => {
      switch (callback.errorCode) {
        case 1:
          setIsReceiving(false)
          setIsRunning(false)
          messageAPI.error({
            content: t("editor.ai-agent.message.start-failed"),
          })
          break
        case 15:
          const needUpdateMessageList = cancelPendingMessage(
            chatMessagesRef.current,
          )
          if (needUpdateMessageList) {
            chatMessagesRef.current = needUpdateMessageList
            setChatMessages(needUpdateMessageList)
          }
          setIsReceiving(false)
          break
        case 16:
          messageAPI.error({
            content: t("editor.ai-agent.message.token"),
          })
          break
        case 17:
        case 18:
          collaModal({
            modalType: WooModalType.TOKEN,
            from: "agent_run",
          })
          break
        case 3:
          break
      }
    },
    [collaModal, messageAPI, t],
  )

  const getConnectParams = useCallback(async () => {
    const currentTeamID = getCurrentId(store.getState())!
    try {
      const { aiAgentConnectionAddress } =
        await triggerGetAIAgentAnonymousAddressQuery(currentTeamID).unwrap()

      const initConnectConfig: IInitWSCallback = {
        onConnecting: (isConnecting) => {
          setIsConnecting(isConnecting)
        },
        onReceiving: (isReceiving) => {
          setIsReceiving(isReceiving)
        },

        onMessageSuccessCallback,
        onMessageFailedCallback,
        address: aiAgentConnectionAddress,
      }
      return initConnectConfig
    } catch (e) {
      const res = handleWooPurchaseError(e, WooModalType.TOKEN, "agent_run")
      if (res) return
      messageAPI.error({
        content: t("editor.ai-agent.message.start-failed"),
      })
    }
  }, [
    messageAPI,
    onMessageFailedCallback,
    onMessageSuccessCallback,
    t,
    triggerGetAIAgentAnonymousAddressQuery,
  ])

  const innerConnect = useCallback(async () => {
    const initConnectConfig = await getConnectParams()
    if (!initConnectConfig) return
    await connect?.(initConnectConfig)
    setIsConnecting(false)
    setIsRunning(true)
    setIsReceiving(true)
  }, [connect, getConnectParams])

  const innerLeaveRoom = useCallback(() => {
    cleanMessage()
    leaveRoom()
  }, [cleanMessage, leaveRoom])

  const innerReconnect = useCallback(async () => {
    innerLeaveRoom()
    setIsRunning(false)
    await innerConnect()
  }, [innerConnect, innerLeaveRoom])

  const stableValue = useMemo(() => {
    return {
      sendMessage: innerSendMessage,
      reconnect: innerReconnect,
      connect: innerConnect,
      setIsReceiving,
      leaveRoom: innerLeaveRoom,
    }
  }, [innerConnect, innerLeaveRoom, innerReconnect, innerSendMessage])

  const unStableValue = useMemo(
    () => ({
      wsStatus,
      isConnecting,
      isReceiving,
      isRunning,
      inRoomUsers,
      chatMessages,
    }),
    [chatMessages, inRoomUsers, isConnecting, isReceiving, isRunning, wsStatus],
  )

  return (
    <ChatStableWSContext.Provider value={stableValue}>
      <ChatUnStableWSContext.Provider value={unStableValue}>
        {children}
      </ChatUnStableWSContext.Provider>
    </ChatStableWSContext.Provider>
  )
}
