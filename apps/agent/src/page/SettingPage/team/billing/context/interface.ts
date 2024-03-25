import { ICreditInfo } from "@illa-public/public-types"

export interface BillingContextTypeProps {
  creditInfo: ICreditInfo
  isUnSubscribeCredit: boolean
  isCancelSubscribedCredit: boolean
  isExpiredCredit: boolean
  loading: boolean
  openCreditDrawer?: () => void
}
