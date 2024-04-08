import { ICreditInfo, SUBSCRIPTION_CYCLE } from "@illa-public/public-types"

export interface BillingContextTypeProps {
  creditInfo: ICreditInfo
  isUnSubscribeCredit: boolean
  isCancelSubscribedCredit: boolean
  isExpiredCredit: boolean
  loading: boolean
  openCreditDrawer: (subCycle?: SUBSCRIPTION_CYCLE) => void
}
