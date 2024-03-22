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
  SenderType,
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
  const collaModal = useCollarModal()

  const [triggerGetAIAgentAnonymousAddressQuery] =
    useLazyGetAIAgentAnonymousAddressQuery()
  const [triggerGetAIAgentWsAddressQuery] = useLazyGetAIAgentWsAddressQuery()

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
      let index = -1
      if (getValues("aiAgentID")) {
        index = updateRoomUsers.findIndex(
          (user) => user.id === getValues("aiAgentID"),
        )
      } else {
        index = updateRoomUsers.findIndex(
          (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
        )
      }
      if (index != -1) {
        updateRoomUsers[index].avatar = icon
      }
      return updateRoomUsers
    },
    [getValues],
  )

  const updateLocalName = useCallback(
    (name: string, newRoomUsers: CollaboratorsInfo[]) => {
      const updateRoomUsers = [...newRoomUsers]
      let index = -1
      if (getValues("aiAgentID")) {
        index = updateRoomUsers.findIndex(
          (user) => user.id === getValues("aiAgentID"),
        )
      } else {
        index = updateRoomUsers.findIndex(
          (user) => user.roomRole === SenderType.ANONYMOUS_AGENT,
        )
      }
      if (index != -1) {
        updateRoomUsers[index].nickname = name
      }
      return updateRoomUsers
    },
    [getValues],
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
        setChatMessages([...chatMessages, messageContent])
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
            prompt: getValues("prompt"),
            actionID: getValues("aiAgentID"),
            modelConfig: getValues("modelConfig"),
            model: getValues("model"),
            agentType: getValues("agentType"),
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
    [
      cleanMessage,
      getValues,
      innerSendMessage,
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
      const res = handleWooPurchaseError(e, WooModalType.TOKEN, "agent_run")
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
      sendMessage: innerSendMessage,
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
    innerSendMessage,
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
