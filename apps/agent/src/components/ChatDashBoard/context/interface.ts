import { ReactNode } from "react"
import {
  IHumanMessageDTO,
  IMessageCycleVO,
  IMessageFileVO,
  READYSTATE,
} from "../interface"

export interface IChatStableWSInject {
  handleSendMessage: (
    sendMessage: IHumanMessageDTO,
    sendFiles?: IMessageFileVO[],
  ) => void
}

export interface IChatUnStableWSInject {
  readyState: READYSTATE
  cycleMessageList: IMessageCycleVO[]
  currentRenderCycle: IMessageCycleVO | null
}

export interface IChatProviderProps {
  children: ReactNode
}

export interface ICustomSSEResponse {
  data: string
}
