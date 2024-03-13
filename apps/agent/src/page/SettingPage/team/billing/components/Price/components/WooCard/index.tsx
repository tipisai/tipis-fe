import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { useCollarDrawer } from "@illa-public/upgrade-modal"
import WooCardMobile from "./mobile"
import WooCardPC from "./pc"

const WooCard = () => {
  const wooDrawer = useCollarDrawer()
  const openWooDrawer = (subCycle?: SUBSCRIPTION_CYCLE) => {
    wooDrawer("pricing", { subCycle })
  }
  return (
    <LayoutAutoChange
      desktopPage={<WooCardPC openWooDrawer={openWooDrawer} />}
      mobilePage={<WooCardMobile openWooDrawer={openWooDrawer} />}
    />
  )
}

export default WooCard
