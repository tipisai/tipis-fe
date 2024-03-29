import { FC, lazy, useEffect } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { useAddExploreTipisTab } from "@/utils/recentTabs/hook"
import { DashboardUIStateProvider } from "./context/marketListContext"

const TipisPCDashboard = lazy(() => import("./pc"))
const TipisMobileDashboard = lazy(() => import("./mobile"))

const TipisDashboard: FC = () => {
  const addExploreTipiTab = useAddExploreTipisTab()

  useEffect(() => {
    addExploreTipiTab()
  }, [addExploreTipiTab])

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
