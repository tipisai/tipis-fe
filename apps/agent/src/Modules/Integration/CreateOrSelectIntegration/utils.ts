import { createContext, useContext } from "react"
import { ISelectIntegrationInject } from "./interface"

export const IntegrationSelectorContext = createContext(
  {} as ISelectIntegrationInject,
)

export const useIntegrationSelectorContext = () => {
  const context = useContext(IntegrationSelectorContext)
  return context
}
