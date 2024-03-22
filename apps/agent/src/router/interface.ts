import { ComponentType, ReactNode } from "react"
import { IndexRouteObject, NonIndexRouteObject } from "react-router-dom"
import { USER_ROLE } from "@illa-public/public-types"

export interface BaseProtectComponentProps {
  children: ReactNode
  needRole?: USER_ROLE[]
}

export type ExtRoutesObjectAttr = {
  /**
   * @description need login, if use check role,can replace this
   */
  needRole?: USER_ROLE[]
  ProtectComponent?: ComponentType<BaseProtectComponentProps>
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
