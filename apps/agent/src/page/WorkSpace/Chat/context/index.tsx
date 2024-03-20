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
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import { WooModalType, useCollarModal } from "@illa-public/upgrade-modal"
import { getCurrentTeamInfo, getCurrentUser } from "@illa-public/user-data"
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
import { DEFAULT_PROMO, INIT_CHAT_CONFIG } from "../constants"
import { IAgentWSInject, IChatWSProviderProps } from "./interface"
import { isNormalMessage } from "./typeHelper"
import { cancelPendingMessage, formatSendMessagePayload } from "./utils"

export const ChatWSContext = createContext({} as IAgentWSInject)

export const ChatWSProvider: FC<IChatWSProviderProps> = (props) => {
  const { children } = props

  const { message: messageAPI } = App.useApp()

  const { t } = useTranslation()

  const collaModal = useCollarModal()

  const currentUserInfo = useSelector(getCurrentUser)
  const currentTeamInfo = useSelector(getCurrentTeamInfo)

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

  const [isConnecting, setIsConnecting] = useState(false)
  const [isReceiving, setIsReceiving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [inRoomUsers, setInRoomUsers] = useState<CollaboratorsInfo[]>([])
  const [chatMessages, setChatMessages] = useState<
    (IGroupMessage | ChatMessage)[]
  >([])
  const chatMessagesRef = useRef<(IGroupMessage | ChatMessage)[]>([])

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

  const { sendMessage, reconnect, connect, wsStatus, leaveRoom } = useContext(
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
        currentTeamInfo?.id ?? "",
        currentUserInfo.userID,
        [encodePayload],
      )
      sendMessage(textMessage)

      if (updateMessage && messageContent) {
        chatMessagesRef.current = [...chatMessagesRef.current, messageContent]
        setChatMessages([...chatMessages, messageContent])
      }
    },
    [chatMessages, currentTeamInfo?.id, currentUserInfo.userID, sendMessage],
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

  const getConnectAddress = useCallback(async () => {
    try {
      const { aiAgentConnectionAddress } =
        await triggerGetAIAgentAnonymousAddressQuery(
          currentTeamInfo!.id,
        ).unwrap()

      return aiAgentConnectionAddress
    } catch (e) {
      setIsConnecting(true)
      throw e
    }
  }, [currentTeamInfo, triggerGetAIAgentAnonymousAddressQuery])

  const getConnectParams = useCallback(() => {
    const initConnectConfig: IInitWSCallback = {
      onConnecting: (isConnecting) => {
        setIsConnecting(isConnecting)
      },
      onReceiving: (isReceiving) => {
        setIsReceiving(isReceiving)
      },

      onMessageSuccessCallback,
      onMessageFailedCallback,
      getConnectAddress: getConnectAddress,
    }
    return initConnectConfig
  }, [getConnectAddress, onMessageFailedCallback, onMessageSuccessCallback])

  const innerConnect = useCallback(async () => {
    const initConnectConfig = getConnectParams()
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
    const initConnectConfig = getConnectParams()
    innerLeaveRoom()
    setIsRunning(false)
    await reconnect(initConnectConfig)
  }, [getConnectParams, innerLeaveRoom, reconnect])

  const value = useMemo(() => {
    return {
      sendMessage: innerSendMessage,
      chatMessages,
      reconnect: innerReconnect,
      connect: innerConnect,
      wsStatus,
      isConnecting,
      isReceiving,
      isRunning,
      inRoomUsers,
      setIsReceiving,
      leaveRoom: innerLeaveRoom,
    }
  }, [
    chatMessages,
    inRoomUsers,
    innerConnect,
    innerLeaveRoom,
    innerReconnect,
    innerSendMessage,
    isConnecting,
    isReceiving,
    isRunning,
    wsStatus,
  ])

  return (
    <ChatWSContext.Provider value={value}>{children}</ChatWSContext.Provider>
  )
}
