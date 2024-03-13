import { IndexRouteObject, NonIndexRouteObject } from "react-router-dom"
import { USER_ROLE } from "@illa-public/public-types"

export type ExtRoutesObjectAttr = {
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

export type IndexRouteObjectPro = IndexRouteObject &
  Omit<ExtRoutesObjectAttr, "children">
export type NonIndexRouteObjectPro = Omit<NonIndexRouteObject, "children"> &
  ExtRoutesObjectAttr

export type RoutesObjectPro = IndexRouteObjectPro | NonIndexRouteObjectPro
