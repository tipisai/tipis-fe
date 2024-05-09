import { ComponentType, lazy } from "react"
import { TIntegrationType } from "@illa-public/public-types"

const TencentCosConfigElement = lazy(() => import("./modules/TencentCos"))
const LarkBotConfigElement = lazy(() => import("./modules/LarkBot"))

export const INTEGRATION_TYPE_MAP_CONFIG_ELEMENT: Record<
  TIntegrationType,
  ComponentType
> = {
  larkim: LarkBotConfigElement,
  tencentcos: TencentCosConfigElement,
}
