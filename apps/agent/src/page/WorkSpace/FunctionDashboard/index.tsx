import { FC, lazy, useEffect } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { useAddExploreFunctionsTab } from "@/utils/recentTabs/hook"
import { FunctionDashboardUIStateProvider } from "./context/functionDashboard"

const FunctionsPCDashboard = lazy(() => import("./pc"))
const FunctionsMobileDashboard = lazy(() => import("./mobile"))

const FunctionsDashboard: FC = () => {
  const addExploreFunctionTab = useAddExploreFunctionsTab()

  useEffect(() => {
    addExploreFunctionTab()
  }, [addExploreFunctionTab])

  return (
    <FunctionDashboardUIStateProvider>
      <LayoutAutoChange
        desktopPage={<FunctionsPCDashboard />}
        mobilePage={<FunctionsMobileDashboard />}
      />
    </FunctionDashboardUIStateProvider>
  )
}

export default FunctionsDashboard
