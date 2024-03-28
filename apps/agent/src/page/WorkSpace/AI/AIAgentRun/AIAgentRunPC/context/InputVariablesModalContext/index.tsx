import { FC, createContext, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { IAgentForm } from "../../../../AIAgent/interface"
import InputVariables from "../../../components/InputVariables"
import {
  IInputVariablesModalInject,
  IInputVariablesModalProviderProps,
} from "./interface"

export const InputVariablesModalContext = createContext(
  {} as IInputVariablesModalInject,
)

export const InputVariablesModalProvider: FC<
  IInputVariablesModalProviderProps
> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const canOpenModal = useRef(true)
  const { control } = useFormContext<IAgentForm>()

  const [variables] = useWatch({
    control,
    name: ["variables"],
  })

  const hasVariables = variables.length > 0

  return (
    <InputVariablesModalContext.Provider
      value={{
        canOpenModal,
        changeCanOpenModal: (newCanOpenModal: boolean) => {
          canOpenModal.current = newCanOpenModal
        },
        isModalOpen,
        changeIsModalOpen: (isModalOpen: boolean) => {
          setIsModalOpen(isModalOpen)
        },
      }}
    >
      {props.children}
      {hasVariables && <InputVariables />}
    </InputVariablesModalContext.Provider>
  )
}
