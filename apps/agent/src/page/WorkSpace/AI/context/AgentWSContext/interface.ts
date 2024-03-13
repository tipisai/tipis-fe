import { ReactNode } from "react"
import { Agent } from "@illa-public/public-types"
import { CollaboratorsInfo } from "../../components/PreviewChat/interface"
import { TipisWebSocketContextType } from "../newAgentWSContext/interface"

export interface IAgentWSProviderProps {
  children: ReactNode
}

export interface IAgentWSInject
  extends Omit<TipisWebSocketContextType, "connect" | "reconnect"> {
  lastRunAgent: Agent | undefined
  isConnecting: boolean
  isReceiving: boolean
  isRunning: boolean
  inRoomUsers: CollaboratorsInfo[]
  setIsReceiving: (isReceiving: boolean) => void
  connect: () => Promise<void>
  reconnect: () => Promise<void>
}
