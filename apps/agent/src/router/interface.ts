import { USER_ROLE } from "@illa-public/public-types"
import { RouteObject } from "react-router-dom"

export type RoutesObjectPro = RouteObject & {
  /**
   * @description need login, if use check role,can replace this
   */
  needLogin?: boolean
  needRole?: USER_ROLE[]
  /**
   * @description child route
   */
  children?: RoutesObjectPro[]
  accessByMobile?: boolean
}
