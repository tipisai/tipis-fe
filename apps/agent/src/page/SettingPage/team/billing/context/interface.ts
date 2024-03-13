import { CollarInfo } from "@illa-public/public-types"

export interface BillingContextTypeProps {
  wooInfo: CollarInfo
  isUnSubscribeWoo: boolean
  isCancelSubscribedWoo: boolean
  isExpiredWoo: boolean
  loading: boolean
  openWooDrawer?: () => void
}
