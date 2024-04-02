import { FC, lazy } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"

const EmptyTeamPC = lazy(() => import("./pc"))
const EmptyMobile = lazy(() => import("./mobile"))

const Empty: FC = () => {
  return (
    <LayoutAutoChange
      desktopPage={<EmptyTeamPC />}
      mobilePage={<EmptyMobile />}
    />
  )
}

export default Empty
