import { createContext } from "react"
import { BillingContextTypeProps } from "./interface"

export const BillingContext = createContext<BillingContextTypeProps>(
  {} as BillingContextTypeProps,
)
