import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { useCreditDrawer } from "@illa-public/upgrade-modal"
import CreditCardMobile from "./mobile"
import CreditCardPC from "./pc"

const CreditCard = () => {
  const creditDrawer = useCreditDrawer()
  const openCreditDrawer = (subCycle?: SUBSCRIPTION_CYCLE) => {
    creditDrawer("pricing", { subCycle })
  }
  return (
    <LayoutAutoChange
      desktopPage={<CreditCardPC openCreditDrawer={openCreditDrawer} />}
      mobilePage={<CreditCardMobile openCreditDrawer={openCreditDrawer} />}
    />
  )
}

export default CreditCard
