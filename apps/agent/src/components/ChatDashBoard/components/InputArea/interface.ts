import { IHumanMessageDTO } from "../../interface"

export interface IInputAreaProps {
  sendMessage: (humanMessage: IHumanMessageDTO) => void
}
