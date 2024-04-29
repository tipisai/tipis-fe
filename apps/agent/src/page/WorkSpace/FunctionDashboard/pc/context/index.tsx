import { createContext } from "react"
import { IFunctionDashboardContext } from "./interface"

export const FunctionDashboardContext =
  createContext<IFunctionDashboardContext>({} as IFunctionDashboardContext)
