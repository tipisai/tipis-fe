import { FC, createContext, useCallback, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
import {
  CollaboratorsInfo,
  SenderType,
} from "../../components/PreviewChat/interface"
import { useAgentConnect } from "../../components/ws/useAgentConnect"
import { UseAgentProps } from "../../components/ws/useAgentProps"
import { IAgentWSInject, IAgentWSProviderProps } from "./interface"

export const AgentWSContext = createContext({} as IAgentWSInject)

export const AgentWSProvider: FC<IAgentWSProviderProps> = (props) => {
  const { children } = props

  const { getValues } = useFormContext<Agent>()

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

  const agentInfo = useMemo(
    () => ({
      prompt: getValues("prompt"),
      variables: getValues("variables"),
      // TODO: add knowledge
      actionID: getValues("aiAgentID"),
      modelConfig: getValues("modelConfig"),
      model: getValues("model"),
      agentType: getValues("agentType"),
    }),
    [getValues],
  )

  const agentConnectOptions: UseAgentProps = useMemo(
    () => ({
      agentInfo: agentInfo,
      onStartRunning: () => {
        setLastRunAgent(getRunAgent())
      },
      onConnecting: (isConnecting) => {
        setIsConnecting(isConnecting)
      },
      onReceiving: (isReceiving) => {
        setIsReceiving(isReceiving)
      },
      onRunning: (isRunning: boolean) => {
        setIsRunning(isRunning)
      },
      onUpdateRoomUsers: (roomUsers: CollaboratorsInfo[]) => {
        let newRoomUsers = updateLocalIcon(getValues("icon"), roomUsers)
        newRoomUsers = updateLocalName(getValues("name"), roomUsers)
        setInRoomUsers(newRoomUsers)
      },
    }),
    [agentInfo, getRunAgent, getValues, updateLocalIcon, updateLocalName],
  )

  const {
    sendMessage,
    generationMessage,
    chatMessages,
    reconnect,
    connect,
    wsStatus,
    leaveRoom,
  } = useAgentConnect(agentConnectOptions)

  const value = useMemo(() => {
    return {
      sendMessage,
      generationMessage,
      chatMessages,
      reconnect,
      connect,
      wsStatus,
      lastRunAgent,
      isConnecting,
      isReceiving,
      isRunning,
      inRoomUsers,
      setIsReceiving,
      leaveRoom,
    }
  }, [
    chatMessages,
    connect,
    generationMessage,
    inRoomUsers,
    isConnecting,
    isReceiving,
    isRunning,
    lastRunAgent,
    leaveRoom,
    reconnect,
    sendMessage,
    wsStatus,
  ])

  return (
    <AgentWSContext.Provider value={value}>{children}</AgentWSContext.Provider>
  )
}
