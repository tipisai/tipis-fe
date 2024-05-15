import { FC, lazy, useEffect } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import { useNavigateTargetWorkspace } from "@/utils/routeHelper/hook"
import { setLocalTeamIdentifier } from "@/utils/storage/cacheTeam"

const EmptyTeamPC = lazy(() => import("./pc"))
const EmptyMobile = lazy(() => import("./mobile"))

const Empty: FC = () => {
  const { data, isLoading } = useGetTeamsInfoQuery(null)
  const navigateToWorkspace = useNavigateTargetWorkspace()

  useEffect(() => {
    if (!isLoading && Array.isArray(data) && data.length > 0) {
      setLocalTeamIdentifier(data[0].identify)
      navigateToWorkspace()
    }
  }, [data, isLoading, navigateToWorkspace])
  return (
    <LayoutAutoChange
      desktopPage={<EmptyTeamPC />}
      mobilePage={<EmptyMobile />}
    />
  )
}

export default Empty
