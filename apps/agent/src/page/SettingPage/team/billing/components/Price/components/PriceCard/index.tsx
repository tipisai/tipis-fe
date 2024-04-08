import { useContext } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { BillingContext } from "../../../../context"
import CreditCardMobile from "./mobile"
import CreditCardPC from "./pc"

const PriceCard = () => {
  const { openCreditDrawer } = useContext(BillingContext)

  return (
    <LayoutAutoChange
      desktopPage={<CreditCardPC openCreditDrawer={openCreditDrawer} />}
      mobilePage={<CreditCardMobile openCreditDrawer={openCreditDrawer} />}
    />
  )
}

export default PriceCard
