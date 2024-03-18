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
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import { Agent } from "@illa-public/public-types"
import { CollarModalType, useCollarModal } from "@illa-public/upgrade-modal"
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
  SenderType,
} from "@/components/PreviewChat/interface"
import {
  useLazyGetAIAgentAnonymousAddressQuery,
  useLazyGetAIAgentWsAddressQuery,
} from "@/redux/services/agentAPI"
import { IAgentWSInject, IAgentWSProviderProps } from "./interface"
import { formatSendMessagePayload } from "./utils"

export const AgentWSContext = createContext({} as IAgentWSInject)

export const AgentWSProvider: FC<IAgentWSProviderProps> = (props) => {
  const { children } = props

  const { message: messageAPI } = App.useApp()

  const { t } = useTranslation()

  const { getValues } = useFormContext<Agent>()
  const collaModal = useCollarModal()

  const currentUserInfo = useSelector(getCurrentUser)
  const currentTeamInfo = useSelector(getCurrentTeamInfo)

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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const chatMessagesRef = useRef<ChatMessage[]>([])

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
      newMessageList.push({
        sender: message.sender,
        message: message.message,
        threadID: message.threadID,
        messageType: message.messageType,
      } as ChatMessage)
    } else {
      newMessageList[index].message =
        newMessageList[index].message + message.message
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
            modalType: CollarModalType.TOKEN,
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
    const aiAgentID = getValues("aiAgentID")
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
      return address
    } catch (e) {
      setIsConnecting(true)
      throw e
    }
  }, [
    currentTeamInfo,
    getValues,
    triggerGetAIAgentAnonymousAddressQuery,
    triggerGetAIAgentWsAddressQuery,
  ])

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
