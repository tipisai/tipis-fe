import { MutableRefObject, ReactNode } from "react"

export interface IInputVariablesModalProviderProps {
  children: ReactNode
}

export interface IInputVariablesModalInject {
  canOpenModal: MutableRefObject<boolean>
  changeCanOpenModal: (canOpenModal: boolean) => void
  isModalOpen: boolean
  changeIsModalOpen: (isModalOpen: boolean) => void
}
