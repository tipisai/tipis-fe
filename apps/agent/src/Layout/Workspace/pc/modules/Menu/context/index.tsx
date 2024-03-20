import { FC, createContext, useState } from "react"
import { IMenuInject, IMenuStatusUIProviderProps } from "./interface"

export const MenuStatusUIContext = createContext({} as IMenuInject)

export const MenuStatusUIProvider: FC<IMenuStatusUIProviderProps> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <MenuStatusUIContext.Provider
      value={{ collapsed, changeCollapsed: setCollapsed }}
    >
      {children}
    </MenuStatusUIContext.Provider>
  )
}
