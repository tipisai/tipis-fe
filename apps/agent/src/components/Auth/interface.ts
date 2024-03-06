import { USER_ROLE } from "@illa-public/public-types"
import { ReactNode } from "react"

export interface AuthProps {
  children: ReactNode
  needRole?: USER_ROLE[]
}
