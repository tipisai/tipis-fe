import { ReactNode } from "react"

export interface ICreateTeamModalContextInject {
  onChangeTeamVisible: (visible: boolean) => void | undefined
}

export interface ICreateTeamContextProviderProps {
  children: ReactNode
}
