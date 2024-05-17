import { UIEventHandler } from "react"
import { IMessageCycleVO } from "../../interface"

export interface IMessageListProps {
  handleScroll: UIEventHandler<HTMLDivElement>
  cycleMessageList: IMessageCycleVO[]
  currentRenderCycle: IMessageCycleVO | null
}
