import { ReactNode } from "react"
import { USER_ROLE } from "@illa-public/public-types"

export interface AuthProps {
  children: ReactNode
  needRole?: USER_ROLE[]
}
