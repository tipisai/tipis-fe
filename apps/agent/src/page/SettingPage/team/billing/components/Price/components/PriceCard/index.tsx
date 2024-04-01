import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { useCreditDrawer } from "@illa-public/upgrade-modal"
import { BILLING_REPORT_FROM } from "@illa-public/upgrade-modal/constants"
import CreditCardMobile from "./mobile"
import CreditCardPC from "./pc"

const PriceCard = () => {
  const creditDrawer = useCreditDrawer()
  const openCreditDrawer = (subCycle?: SUBSCRIPTION_CYCLE) => {
    creditDrawer(BILLING_REPORT_FROM.SETTING_BILLING, { subCycle })
  }
  return (
    <LayoutAutoChange
      desktopPage={<CreditCardPC openCreditDrawer={openCreditDrawer} />}
      mobilePage={<CreditCardMobile openCreditDrawer={openCreditDrawer} />}
    />
  )
}

export default PriceCard
