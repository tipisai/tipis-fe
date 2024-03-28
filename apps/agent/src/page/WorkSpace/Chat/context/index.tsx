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
import {
  CreditModalType,
  handleCreditPurchaseError,
  useCreditModal,
} from "@illa-public/upgrade-modal"
import { getCurrentId } from "@illa-public/user-data"
import { getTextMessagePayload, getWithFileMessagePayload } from "@/api/ws"
import { Callback } from "@/api/ws/interface"
import { TextSignal, TextTarget } from "@/api/ws/textSignal"
import defaultChatIconURL from "@/assets/public/logo.svg"
import { TipisWebSocketContext } from "@/components/PreviewChat/TipisWebscoketContext"
import {
  IInitWSCallback,
  ISendMessageOptions,
  SEND_MESSAGE_WS_TYPE,
} from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  useUpdateAnonymousAvatar,
  useUpdateAnonymousName,
} from "@/components/PreviewChat/hooks"
import {
  ChatMessage,
  ChatSendRequestPayload,
  ChatWsAppendResponse,
  CollaboratorsInfo,
  IGroupMessage,
} from "@/components/PreviewChat/interface"
import { useLazyGetAIAgentAnonymousAddressQuery } from "@/redux/services/agentAPI"
import store from "@/redux/store"
import {
  cancelPendingMessage,
  formatSendMessagePayload,
  groupReceivedMessagesForUI,
} from "@/utils/agent/wsUtils"
import {
  IChatStableWSInject,
  IChatUnStableWSInject,
  IChatWSProviderProps,
} from "./interface"

export const ChatStableWSContext = createContext({} as IChatStableWSInject)
export const ChatUnStableWSContext = createContext({} as IChatUnStableWSInject)

export const ChatWSProvider: FC<IChatWSProviderProps> = (props) => {
  const { children } = props

  const { message: messageAPI } = App.useApp()

  const { t } = useTranslation()

  const creditModal = useCreditModal()

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

  const updateLocalIcon = useUpdateAnonymousAvatar()
  const updateLocalName = useUpdateAnonymousName()

  const onUpdateRoomUser = useCallback(
    (roomUsers: CollaboratorsInfo[]) => {
      let newRoomUsers = updateLocalIcon(defaultChatIconURL, roomUsers)
      newRoomUsers = updateLocalName(
        t("homepage.left_panel.tab.tipi_chat"),
        roomUsers,
      )
      setInRoomUsers(newRoomUsers)
    },
    [t, updateLocalIcon, updateLocalName],
  )

  const onUpdateChatMessage = useCallback((message: ChatMessage) => {
    const newMessageList = groupReceivedMessagesForUI(
      chatMessagesRef.current,
      message,
    )
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

  const startSendMessage = useCallback(
    (
      payload: ChatSendRequestPayload,
      signal: TextSignal,
      type: SEND_MESSAGE_WS_TYPE,
      options?: ISendMessageOptions,
    ) => {
      setIsReceiving(true)

      const encodePayload: ChatSendRequestPayload =
        formatSendMessagePayload(payload)

      if (options?.fileIDs && options.fileIDs.length > 0) {
        const withFileTextMessage = getWithFileMessagePayload(options.fileIDs)
        sendMessage(withFileTextMessage)
      }
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
    },
    [sendMessage],
  )

  const chatSendMessage = useCallback(
    (
      payload: ChatSendRequestPayload,
      signal: TextSignal,
      type: SEND_MESSAGE_WS_TYPE,
      options?: ISendMessageOptions,
    ) => {
      setIsReceiving(true)

      const encodePayload: ChatSendRequestPayload =
        formatSendMessagePayload(payload)

      if (options?.fileIDs && options.fileIDs.length > 0) {
        const withFileTextMessage = getWithFileMessagePayload(options.fileIDs)
        sendMessage(withFileTextMessage)
      }
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

      if (options?.updateMessage && options?.messageContent) {
        chatMessagesRef.current = [
          ...chatMessagesRef.current,
          options?.messageContent,
        ]
        setChatMessages([...chatMessages, options?.messageContent])
      }
    },
    [chatMessages, sendMessage],
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
          startSendMessage(
            {} as ChatSendRequestPayload,
            TextSignal.CLEAN,
            SEND_MESSAGE_WS_TYPE.CLEAN,
          )
          break
        case "chat/remote":
          let chatCallback = callback.broadcast.payload as ChatWsAppendResponse

          onUpdateChatMessage(chatCallback)
          break
        case "stop_all/remote":
          break
        case "clean/remote":
          setIsReceiving(false)
          break
      }
    },
    [cleanMessage, startSendMessage, onUpdateChatMessage, onUpdateRoomUser],
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
          creditModal({
            modalType: CreditModalType.TOKEN,
            from: "agent_run",
          })
          break
        case 3:
          break
      }
    },
    [creditModal, messageAPI, t],
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
      const res = handleCreditPurchaseError(
        e,
        CreditModalType.TOKEN,
        "agent_run",
      )
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
      sendMessage: chatSendMessage,
      reconnect: innerReconnect,
      connect: innerConnect,
      setIsReceiving,
      leaveRoom: innerLeaveRoom,
    }
  }, [innerConnect, innerLeaveRoom, innerReconnect, chatSendMessage])

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
