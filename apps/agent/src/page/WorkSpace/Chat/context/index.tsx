import { App } from "antd"
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useBeforeUnload, useParams } from "react-router-dom"
import {
  CreditModalType,
  handleCreditPurchaseError,
  useCreditModal,
} from "@illa-public/upgrade-modal"
import { BILLING_REPORT_FROM } from "@illa-public/upgrade-modal/constants"
import { getCurrentId } from "@illa-public/user-data"
import { getTextMessagePayload, getWithFileMessagePayload } from "@/api/ws"
import { Callback, FILE_SOURCE } from "@/api/ws/interface"
import {
  TextSignal,
  TextTarget,
  WEBSOCKET_ERROR_CODE,
} from "@/api/ws/textSignal"
import defaultChatIconURL from "@/assets/public/tipiChatAvatar.png"
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
  delayHandleTask,
  formatSendMessagePayload,
  getNeedCacheUIMessage,
  groupReceivedMessagesForUI,
} from "@/utils/agent/wsUtils"
import {
  getChatMessageAndUIState,
  removeChatMessageAndUIState,
  setChatMessageAndUIState,
} from "@/utils/localForage/teamData"
import {
  ICachePayloadQueue,
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
  const cacheChatMessages = useRef<unknown[]>([])
  const cacheMessageQueue = useRef<ICachePayloadQueue[]>([])
  const teamID = useSelector(getCurrentId)
  const { chatID } = useParams()

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
    if (newMessageList) {
      chatMessagesRef.current = newMessageList
      setChatMessages(newMessageList)
    }
  }, [])

  const { sendMessage, connect, getReadyState, leaveRoom, cleanMessage } =
    useContext(TipisWebSocketContext)

  const setCacheState = useCallback(() => {
    if (chatID && teamID && chatMessagesRef.current.length > 0) {
      const uiMessageList = getNeedCacheUIMessage(chatMessagesRef.current)

      setChatMessageAndUIState(
        teamID,
        chatID,
        uiMessageList,
        cacheChatMessages.current,
      )
    }
  }, [chatID, teamID])

  const startSendMessage = useCallback(
    (
      payload: ChatSendRequestPayload,
      signal: TextSignal,
      type: SEND_MESSAGE_WS_TYPE,
      options?: ISendMessageOptions,
    ) => {
      const encodePayload: ChatSendRequestPayload = formatSendMessagePayload(
        JSON.parse(JSON.stringify(payload)),
      )
      if (options?.fileIDs && options.fileIDs.length > 0) {
        const withFileTextMessage = getWithFileMessagePayload(
          options.fileIDs,
          FILE_SOURCE.FILES,
        )
        sendMessage(withFileTextMessage)
        cacheMessageQueue.current.push({
          payload,
          signal,
          type,
        })
      } else {
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
      }
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
      const encodePayload: ChatSendRequestPayload = formatSendMessagePayload(
        JSON.parse(JSON.stringify(payload)),
      )

      if (options?.fileIDs && options.fileIDs.length > 0) {
        const withFileTextMessage = getWithFileMessagePayload(
          options.fileIDs,
          FILE_SOURCE.TEMPORARY_FILES,
        )
        sendMessage(withFileTextMessage)
        cacheMessageQueue.current.push({
          payload,
          signal,
          type,
        })
      } else {
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
      }

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

  const clearCacheQueue = useCallback(() => {
    while (cacheMessageQueue.current.length > 0) {
      const cachePayload = cacheMessageQueue.current.pop()
      if (cachePayload) {
        startSendMessage(
          cachePayload.payload,
          cachePayload.signal,
          cachePayload.type,
        )
      }
    }
  }, [startSendMessage])

  const initChatMessage = useCallback(async () => {
    if (!teamID || !chatID) {
      return
    }

    const { chatMessageData, uiChatMessage } = await getChatMessageAndUIState(
      teamID,
      chatID,
    )
    if (
      Array.isArray(uiChatMessage) &&
      Array.isArray(chatMessageData) &&
      uiChatMessage.length > 0 &&
      chatMessageData.length > 0
    ) {
      setChatMessages(uiChatMessage)
      chatMessagesRef.current = uiChatMessage
      cacheChatMessages.current = chatMessageData
      const textMessage = getTextMessagePayload(
        TextSignal.RECOVER_HISTORY_MESSAGE,
        TextTarget.ACTION,
        true,
        {
          type: "",
          payload: "",
        },
        "",
        "",
        chatMessageData,
      )
      sendMessage(textMessage)
      return
    }
    setChatMessages([])
    chatMessagesRef.current = []
    cacheChatMessages.current = []
    startSendMessage(
      {} as ChatSendRequestPayload,
      TextSignal.CLEAN_CHAT_HISTORY,
      SEND_MESSAGE_WS_TYPE.CLEAN,
    )
  }, [chatID, sendMessage, startSendMessage, teamID])

  const onMessageSuccessCallback = useCallback(
    (callback: Callback<unknown>) => {
      switch (callback.broadcast?.type) {
        case "enter/remote":
          const { inRoomUsers } = callback.broadcast.payload as {
            inRoomUsers: CollaboratorsInfo[]
          }
          onUpdateRoomUser(inRoomUsers)
          initChatMessage()
          break
        case "chat/remote":
          let chatCallback = callback.broadcast.payload as ChatWsAppendResponse
          onUpdateChatMessage(chatCallback)
          break
        case "stop_all/remote":
          const needUpdateMessageList = cancelPendingMessage(
            chatMessagesRef.current,
          )
          if (needUpdateMessageList) {
            chatMessagesRef.current = needUpdateMessageList
            setChatMessages(needUpdateMessageList)
          }
          break
        case "clean/remote":
          setIsReceiving(false)
          break
      }
    },
    [onUpdateRoomUser, initChatMessage, onUpdateChatMessage],
  )

  const onMessageFailedCallback = useCallback(
    (callback: Callback<unknown>) => {
      switch (callback.errorCode) {
        case WEBSOCKET_ERROR_CODE.ERROR_CODE_FAILED:
          setIsReceiving(false)
          setIsRunning(false)
          messageAPI.error({
            content: t("editor.ai-agent.message.start-failed"),
          })
          break
        case WEBSOCKET_ERROR_CODE.ERROR_MESSAGE_END:
          const needUpdateMessageList = cancelPendingMessage(
            chatMessagesRef.current,
          )
          if (needUpdateMessageList) {
            chatMessagesRef.current = needUpdateMessageList
            setChatMessages(needUpdateMessageList)
          }
          setIsReceiving(false)
          break
        case WEBSOCKET_ERROR_CODE.CONTEXT_LENGTH_EXCEEDED:
          messageAPI.error({
            content: t("editor.ai-agent.message.token"),
          })
          break
        case WEBSOCKET_ERROR_CODE.INSUFFICIENT_CREDIT:
        case WEBSOCKET_ERROR_CODE.AI_AGENT_MAX_TOKEN_OVER_CREDIT_BALANCE:
          creditModal({
            modalType: CreditModalType.TOKEN,
            from: BILLING_REPORT_FROM.RUN,
          })
          break
        case WEBSOCKET_ERROR_CODE.CHAT_FILE_PROCESS_END:
          clearCacheQueue()
          break
        default: {
          break
        }
      }
    },
    [clearCacheQueue, creditModal, messageAPI, t],
  )

  const onMessageCallBack = useCallback(
    (callBackMessage: Callback<unknown>) => {
      switch (callBackMessage.errorCode) {
        case WEBSOCKET_ERROR_CODE.ERROR_CODE_OK: {
          onMessageSuccessCallback(callBackMessage)
          break
        }
        case WEBSOCKET_ERROR_CODE.HISTORY_MESSAGE: {
          cacheChatMessages.current = [
            ...cacheChatMessages.current,
            callBackMessage.broadcast.payload,
          ]

          break
        }
        default: {
          onMessageFailedCallback(callBackMessage)
          break
        }
      }
    },
    [onMessageFailedCallback, onMessageSuccessCallback],
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
        onMessageCallBack,
        onCloseCallback() {
          setCacheState()
          setIsReceiving(false)
        },
        address: aiAgentConnectionAddress,
      }
      return initConnectConfig
    } catch (e) {
      const res = handleCreditPurchaseError(e, CreditModalType.TOKEN)
      if (res) return
      messageAPI.error({
        content: t("editor.ai-agent.message.start-failed"),
      })
    }
  }, [
    messageAPI,
    onMessageCallBack,
    setCacheState,
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
    leaveRoom()
    setIsRunning(false)
  }, [leaveRoom])

  const innerReconnect = useCallback(async () => {
    if (!teamID || !chatID) {
      return
    }
    await delayHandleTask(() => {
      startSendMessage(
        {} as ChatSendRequestPayload,
        TextSignal.STOP_RUN,
        SEND_MESSAGE_WS_TYPE.STOP_ALL,
      )
      setIsReceiving(false)
    })
    cleanMessage()
    setChatMessages([])
    chatMessagesRef.current = []
    await removeChatMessageAndUIState(teamID, chatID)
  }, [chatID, cleanMessage, startSendMessage, teamID])

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
      getReadyState,
      isConnecting,
      isReceiving,
      isRunning,
      inRoomUsers,
      chatMessages,
    }),
    [
      chatMessages,
      inRoomUsers,
      isConnecting,
      isReceiving,
      isRunning,
      getReadyState,
    ],
  )

  useEffect(() => {
    return () => {
      setCacheState()
    }
  }, [setCacheState])

  useBeforeUnload(setCacheState)

  return (
    <ChatStableWSContext.Provider value={stableValue}>
      <ChatUnStableWSContext.Provider value={unStableValue}>
        {children}
      </ChatUnStableWSContext.Provider>
    </ChatStableWSContext.Provider>
  )
}
