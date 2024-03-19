import { IWooInfo } from "@illa-public/public-types"

export interface BillingContextTypeProps {
  wooInfo: IWooInfo
  isUnSubscribeWoo: boolean
  isCancelSubscribedWoo: boolean
  isExpiredWoo: boolean
  loading: boolean
  openWooDrawer?: () => void
}
