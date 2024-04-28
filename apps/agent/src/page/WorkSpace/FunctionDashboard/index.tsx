import { FC, lazy, useEffect } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { useAddExploreFunctionsTab } from "@/utils/recentTabs/hook"
import { DashboardUIStateProvider } from "./context/functionDashboard"

const FunctionsPCDashboard = lazy(() => import("./pc"))
// const TipisMobileDashboard = lazy(() => import("./mobile"))

const FunctionsDashboard: FC = () => {
  const addExploreFunctionTab = useAddExploreFunctionsTab()

  useEffect(() => {
    addExploreFunctionTab()
  }, [addExploreFunctionTab])

  return (
    <DashboardUIStateProvider>
      <LayoutAutoChange
        desktopPage={<FunctionsPCDashboard />}
        mobilePage={<div />}
      />
    </DashboardUIStateProvider>
  )
}

export default FunctionsDashboard
