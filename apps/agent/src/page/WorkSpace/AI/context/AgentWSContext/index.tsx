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
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useBeforeUnload } from "react-router-dom"
import { v4 } from "uuid"
import {
  CreditModalType,
  handleCreditPurchaseError,
  useCreditModal,
} from "@illa-public/upgrade-modal"
import { BILLING_REPORT_FROM } from "@illa-public/upgrade-modal/constants"
import { getCurrentId } from "@illa-public/user-data"
import { getTextMessagePayload, getWithFileMessagePayload } from "@/api/ws"
import {
  Callback,
  FILE_SOURCE,
  ILLA_WEBSOCKET_STATUS,
} from "@/api/ws/interface"
import {
  TextSignal,
  TextTarget,
  WEBSOCKET_ERROR_CODE,
} from "@/api/ws/textSignal"
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
import {
  useLazyGetAIAgentAnonymousAddressQuery,
  useLazyGetAIAgentWsAddressQuery,
} from "@/redux/services/agentAPI"
import store from "@/redux/store"
import {
  cancelPendingMessage,
  formatSendMessagePayload,
  groupReceivedMessagesForUI,
} from "@/utils/agent/wsUtils"
import {
  getChatMessageAndUIState,
  setChatMessageAndUIState,
} from "@/utils/localForage/teamData"
import { IAgentForm } from "../../AIAgent/interface"
import { useGetModeAndTabID } from "../../hook"
import {
  IAgentWSInject,
  IAgentWSProviderProps,
  ICachePayloadQueue,
} from "./interface"

export const AgentWSContext = createContext({} as IAgentWSInject)

export const AgentWSProvider: FC<IAgentWSProviderProps> = (props) => {
  const { children } = props

  const { message: messageAPI } = App.useApp()

  const { t } = useTranslation()
  const teamID = useSelector(getCurrentId)
  const cacheMessageQueue = useRef<ICachePayloadQueue[]>([])

  const { getValues } = useFormContext<IAgentForm>()
  const creditModal = useCreditModal()

  const [triggerGetAIAgentAnonymousAddressQuery] =
    useLazyGetAIAgentAnonymousAddressQuery()
  const [triggerGetAIAgentWsAddressQuery] = useLazyGetAIAgentWsAddressQuery()
  const updateAnonymousLocalIcon = useUpdateAnonymousAvatar()
  const updateAnonymousLocalName = useUpdateAnonymousName()
  const lastRunAgent = useRef<IAgentForm | undefined>()

  const [isConnecting, setIsConnecting] = useState(false)
  const [isReceiving, setIsReceiving] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [inRoomUsers, setInRoomUsers] = useState<CollaboratorsInfo[]>([])
  const [chatMessages, setChatMessages] = useState<
    (IGroupMessage | ChatMessage)[]
  >([])
  const chatMessagesRef = useRef<(IGroupMessage | ChatMessage)[]>([])
  const cacheChatMessages = useRef<unknown[]>([])

  const { mode, finalTabID } = useGetModeAndTabID()

  const setAndGetRunAgentConfig = useCallback(() => {
    lastRunAgent.current = getValues()
    return {
      variables: lastRunAgent.current.variables,
      model: lastRunAgent.current.model,
      prompt: lastRunAgent.current.prompt,
      agentType: lastRunAgent.current.agentType,
    }
  }, [getValues])

  const updateLocalIcon = useCallback(
    (icon: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      if (getValues("aiAgentID")) {
        const index = updateRoomUsers.findIndex(
          (user) => user.id === getValues("aiAgentID"),
        )
        if (index != -1) {
          updateRoomUsers[index].avatar = icon
        }
        return updateRoomUsers
      }
      return updateAnonymousLocalIcon(icon, newRoomUsers)
    },
    [getValues, updateAnonymousLocalIcon],
  )

  const updateLocalName = useCallback(
    (name: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      if (getValues("aiAgentID")) {
        const index = updateRoomUsers.findIndex(
          (user) => user.id === getValues("aiAgentID"),
        )
        if (index != -1) {
          updateRoomUsers[index].nickname = name
        }
        return updateRoomUsers
      } else {
        return updateAnonymousLocalName(name, newRoomUsers)
      }
    },
    [getValues, updateAnonymousLocalName],
  )

  const onUpdateRoomUser = useCallback(
    (roomUsers: CollaboratorsInfo[]) => {
      let newRoomUsers = updateLocalIcon(getValues("icon"), roomUsers)
      newRoomUsers = updateLocalName(getValues("name"), roomUsers)
      setInRoomUsers(newRoomUsers)
    },
    [getValues, updateLocalIcon, updateLocalName],
  )

  const onUpdateChatMessage = useCallback((message: ChatMessage) => {
    const newMessageList = groupReceivedMessagesForUI(
      chatMessagesRef.current,
      message,
    )
    chatMessagesRef.current = newMessageList
    setChatMessages(newMessageList)
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
        setChatMessages(chatMessagesRef.current)
      }
    },
    [sendMessage],
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
    if (!teamID) {
      return
    }

    const { chatMessageData, uiChatMessage } = await getChatMessageAndUIState(
      teamID,
      finalTabID,
      mode,
    )

    if (
      Array.isArray(uiChatMessage) &&
      Array.isArray(chatMessageData) &&
      uiChatMessage.length > 0 &&
      chatMessageData.length > 0
    ) {
      setChatMessages(uiChatMessage)
      chatMessagesRef.current = uiChatMessage
      const textMessage = getTextMessagePayload(
        TextSignal.RECOVER_HISTORY_MESSAGE,
        TextTarget.ACTION,
        true,
        {
          type: SEND_MESSAGE_WS_TYPE.CHAT,
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
    startSendMessage(
      {} as ChatSendRequestPayload,
      TextSignal.CLEAN_CHAT_HISTORY,
      SEND_MESSAGE_WS_TYPE.CLEAN,
    )
  }, [finalTabID, mode, sendMessage, startSendMessage, teamID])

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
          break
        case "clean/remote":
          const partAgentInfo = {
            prompt: getValues("prompt"),
            actionID: getValues("aiAgentID"),
            modelConfig: getValues("modelConfig"),
            model: getValues("model"),
            agentType: getValues("agentType"),
            // TODO: delete variables
            variables: getValues("variables"),
          }
          startSendMessage(
            {
              ...partAgentInfo,
              threadID: v4(),
            } as ChatSendRequestPayload,
            TextSignal.RUN,
            SEND_MESSAGE_WS_TYPE.CHAT,
            {
              fileIDs: getValues("knowledge")?.map((item) => item.fileID),
            },
          )

          break
      }
    },
    [
      onUpdateRoomUser,
      initChatMessage,
      onUpdateChatMessage,
      getValues,
      startSendMessage,
    ],
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
    const aiAgentID = getValues("aiAgentID")
    let address = ""
    const currentTeamID = getCurrentId(store.getState())!
    try {
      if (aiAgentID === "" || aiAgentID === undefined) {
        const { aiAgentConnectionAddress } =
          await triggerGetAIAgentAnonymousAddressQuery(currentTeamID).unwrap()

        address = aiAgentConnectionAddress
      } else {
        const { aiAgentConnectionAddress } =
          await triggerGetAIAgentWsAddressQuery({
            teamID: currentTeamID,
            aiAgentID: aiAgentID,
          }).unwrap()

        address = aiAgentConnectionAddress
      }
      const initConnectConfig: IInitWSCallback = {
        onConnecting: (isConnecting) => {
          setIsConnecting(isConnecting)
        },
        onReceiving: (isReceiving) => {
          setIsReceiving(isReceiving)
        },
        onMessageCallBack,
        address: address,
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
    getValues,
    messageAPI,
    onMessageCallBack,
    t,
    triggerGetAIAgentAnonymousAddressQuery,
    triggerGetAIAgentWsAddressQuery,
  ])

  const innerConnect = useCallback(async () => {
    const initConnectConfig = await getConnectParams()
    if (!initConnectConfig) return
    await connect(initConnectConfig)
    setIsConnecting(false)
    setIsRunning(true)
    setAndGetRunAgentConfig()
  }, [connect, getConnectParams, setAndGetRunAgentConfig])

  const innerLeaveRoom = useCallback(() => {
    leaveRoom()
  }, [leaveRoom])

  const innerReconnect = useCallback(async () => {
    innerLeaveRoom()
    setIsRunning(false)
    await innerConnect()
  }, [innerConnect, innerLeaveRoom])

  const setCacheState = useCallback(async () => {
    if (
      mode &&
      finalTabID &&
      teamID &&
      wsStatus !== ILLA_WEBSOCKET_STATUS.INIT &&
      !isConnecting
    ) {
      setChatMessageAndUIState(
        teamID,
        finalTabID,
        mode,
        chatMessagesRef.current,
        cacheChatMessages.current,
      )
    }
  }, [finalTabID, isConnecting, mode, teamID, wsStatus])

  useEffect(() => {
    return () => {
      setCacheState()
    }
  }, [setCacheState])

  useBeforeUnload(setCacheState)

  const value = useMemo(() => {
    return {
      sendMessage: chatSendMessage,
      chatMessages,
      reconnect: innerReconnect,
      connect: innerConnect,
      wsStatus,
      lastRunAgent: lastRunAgent,
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
    chatSendMessage,
    isConnecting,
    isReceiving,
    isRunning,
    wsStatus,
  ])

  return (
    <AgentWSContext.Provider value={value}>{children}</AgentWSContext.Provider>
  )
}
