import {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { useFormContext } from "react-hook-form"
import { Agent } from "@illa-public/public-types"
import {
  CollaboratorsInfo,
  SenderType,
} from "../../components/PreviewChat/interface"
import { TipisWebSocketContext } from "../newAgentWSContext"
import { IInitWSCallback } from "../newAgentWSContext/interface"
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

  const getConnectParams = useCallback(() => {
    const agentInfo = getValues()

    const initConnectConfig: IInitWSCallback = {
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
    }
    return {
      agentInfo,
      initConnectConfig,
    }
  }, [getRunAgent, getValues, updateLocalIcon, updateLocalName])

  const {
    sendMessage,
    generationMessage,
    chatMessages,
    reconnect,
    connect,
    wsStatus,
    leaveRoom,
  } = useContext(TipisWebSocketContext)

  const innerConnect = useCallback(async () => {
    const { agentInfo, initConnectConfig } = getConnectParams()
    await connect(agentInfo, initConnectConfig)
  }, [connect, getConnectParams])

  const innerReconnect = useCallback(async () => {
    const { agentInfo, initConnectConfig } = getConnectParams()
    await reconnect(agentInfo, initConnectConfig)
  }, [getConnectParams, reconnect])

  const value = useMemo(() => {
    return {
      sendMessage,
      generationMessage,
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
      leaveRoom,
    }
  }, [
    chatMessages,
    generationMessage,
    inRoomUsers,
    innerConnect,
    innerReconnect,
    isConnecting,
    isReceiving,
    isRunning,
    lastRunAgent,
    leaveRoom,
    sendMessage,
    wsStatus,
  ])

  return (
    <AgentWSContext.Provider value={value}>{children}</AgentWSContext.Provider>
  )
}
