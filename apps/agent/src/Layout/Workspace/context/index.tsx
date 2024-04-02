import { FC, createContext, useState } from "react"
import CreateTeamModal from "../components/CreateTeamModal"
import {
  ICreateTeamContextProviderProps,
  ICreateTeamModalContextInject,
} from "./interface"

// eslint-disable-next-line react-refresh/only-export-components
export const createTeamContext = createContext<ICreateTeamModalContextInject>(
  {} as ICreateTeamModalContextInject,
)

export const CreateTeamContextProvider: FC<ICreateTeamContextProviderProps> = (
  props,
) => {
  const { children } = props

  const [createTeamVisible, setCreateTeamVisible] = useState(false)

  return (
    <createTeamContext.Provider
      value={{
        onChangeTeamVisible: setCreateTeamVisible,
      }}
    >
      {children}
      <CreateTeamModal
        visible={createTeamVisible}
        onCancel={() => setCreateTeamVisible(false)}
      />
    </createTeamContext.Provider>
  )
}
