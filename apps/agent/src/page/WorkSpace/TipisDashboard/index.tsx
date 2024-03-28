import { FC, lazy } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { DashboardUIStateProvider } from "./context/marketListContext"

const TipisPCDashboard = lazy(() => import("./pc"))
const TipisMobileDashboard = lazy(() => import("./mobile"))

const TipisDashboard: FC = () => {
  return (
    <DashboardUIStateProvider>
      <LayoutAutoChange
        desktopPage={<TipisPCDashboard />}
        mobilePage={<TipisMobileDashboard />}
      />
    </DashboardUIStateProvider>
  )
}

export default TipisDashboard
