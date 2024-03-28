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
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { v4 } from "uuid"
import { Agent } from "@illa-public/public-types"
import {
  CreditModalType,
  handleCreditPurchaseError,
  useCreditModal,
} from "@illa-public/upgrade-modal"
import { getCurrentId } from "@illa-public/user-data"
import { getTextMessagePayload, getWithFileMessagePayload } from "@/api/ws"
import { Callback } from "@/api/ws/interface"
import { TextSignal, TextTarget } from "@/api/ws/textSignal"
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
  MESSAGE_STATUS,
} from "@/components/PreviewChat/interface"
import {
  useLazyGetAIAgentAnonymousAddressQuery,
  useLazyGetAIAgentWsAddressQuery,
} from "@/redux/services/agentAPI"
import store from "@/redux/store"
import { isNormalMessage } from "@/utils/agent/typeHelper"
import {
  cancelPendingMessage,
  formatSendMessagePayload,
  handleUpdateMessageList,
  isRequestMessage,
} from "@/utils/agent/wsUtils"
import { IAgentWSInject, IAgentWSProviderProps } from "./interface"

export const AgentWSContext = createContext({} as IAgentWSInject)

export const AgentWSProvider: FC<IAgentWSProviderProps> = (props) => {
  const { children } = props

  const { message: messageAPI } = App.useApp()

  const { t } = useTranslation()

  const { getValues } = useFormContext<Agent>()
  const creditModal = useCreditModal()

  const [triggerGetAIAgentAnonymousAddressQuery] =
    useLazyGetAIAgentAnonymousAddressQuery()
  const [triggerGetAIAgentWsAddressQuery] = useLazyGetAIAgentWsAddressQuery()
  const updateAnonymousLocalIcon = useUpdateAnonymousAvatar()
  const updateAnonymousLocalName = useUpdateAnonymousName()

  const getRunAgent = useCallback(() => {
    return {
      variables: getValues("variables"),
      model: getValues("model"),
      prompt: getValues("prompt"),
      agentType: getValues("agentType"),
      // TODO: add knowledge
    } as Agent
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

  const [lastRunAgent, setLastRunAgent] = useState<Agent | undefined>()
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
      let newRoomUsers = updateLocalIcon(getValues("icon"), roomUsers)
      newRoomUsers = updateLocalName(getValues("name"), roomUsers)
      setInRoomUsers(newRoomUsers)
    },
    [getValues, updateLocalIcon, updateLocalName],
  )

  const onUpdateChatMessage = useCallback((message: ChatMessage) => {
    const newMessageList = [...chatMessagesRef.current]
    const index = newMessageList.findIndex((m) => {
      return m.threadID === message.threadID
    })
    if (index === -1) {
      if (isRequestMessage(message)) {
        newMessageList.push({
          threadID: message.threadID,
          items: [
            {
              sender: message.sender,
              message: message.message,
              threadID: message.threadID,
              messageType: message.messageType,
              status: MESSAGE_STATUS.ANALYZE_PENDING,
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
        handleUpdateMessageList(curMessage, message)
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
      cleanMessage,
      getValues,
      startSendMessage,
      onUpdateChatMessage,
      onUpdateRoomUser,
    ],
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

        onMessageSuccessCallback,
        onMessageFailedCallback,
        address: address,
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
    getValues,
    messageAPI,
    onMessageFailedCallback,
    onMessageSuccessCallback,
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
    setIsReceiving(true)
    setLastRunAgent(getRunAgent())
  }, [connect, getConnectParams, getRunAgent])
  const innerLeaveRoom = useCallback(() => {
    cleanMessage()
    leaveRoom()
  }, [cleanMessage, leaveRoom])

  const innerReconnect = useCallback(async () => {
    innerLeaveRoom()
    setIsRunning(false)
    await innerConnect()
  }, [innerConnect, innerLeaveRoom])

  const value = useMemo(() => {
    return {
      sendMessage: chatSendMessage,
      chatMessages,
      reconnect: innerReconnect,
      connect: innerConnect,
      wsStatus,
      lastRunAgent,
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
    lastRunAgent,
    wsStatus,
  ])

  return (
    <AgentWSContext.Provider value={value}>{children}</AgentWSContext.Provider>
  )
}
