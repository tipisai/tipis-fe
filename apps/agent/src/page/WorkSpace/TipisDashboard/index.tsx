import { FC, lazy } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"

const TipisPCDashboard = lazy(() => import("./pc"))
const TipisMobileDashboard = lazy(() => import("./mobile"))

const TipisDashboard: FC = () => {
  return (
    <LayoutAutoChange
      desktopPage={<TipisPCDashboard />}
      mobilePage={<TipisMobileDashboard />}
    />
  )
}

export default TipisDashboard
