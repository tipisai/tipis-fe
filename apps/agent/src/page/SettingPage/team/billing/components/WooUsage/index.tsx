import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { UsageProvider } from "./context"
import { WooUsageMobile } from "./mobile"
import { WooUsagePC } from "./pc"

export const WooUsage: FC = () => {
  return (
    <UsageProvider>
      <LayoutAutoChange
        desktopPage={<WooUsagePC />}
        mobilePage={<WooUsageMobile />}
      />
    </UsageProvider>
  )
}
