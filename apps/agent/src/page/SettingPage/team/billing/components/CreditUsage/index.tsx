import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { UsageProvider } from "./context"
import { CreditUsageMobile } from "./mobile"
import { CreditUsagePC } from "./pc"

export const CreditUsage: FC = () => {
  return (
    <UsageProvider>
      <LayoutAutoChange
        desktopPage={<CreditUsagePC />}
        mobilePage={<CreditUsageMobile />}
      />
    </UsageProvider>
  )
}
