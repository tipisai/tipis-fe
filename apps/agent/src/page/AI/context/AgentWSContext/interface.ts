import { ReactNode } from "react"
import { Agent } from "@illa-public/public-types"
import { CollaboratorsInfo } from "../../components/PreviewChat/interface"
import { UseAgentReturn } from "../../components/ws/useAgentProps"

export interface IAgentWSProviderProps {
  children: ReactNode
}

export interface IAgentWSInject extends UseAgentReturn {
  lastRunAgent: Agent | undefined
  isConnecting: boolean
  isReceiving: boolean
  isRunning: boolean
  inRoomUsers: CollaboratorsInfo[]
  setIsReceiving: (isReceiving: boolean) => void
}
