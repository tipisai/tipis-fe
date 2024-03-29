import { FC, lazy, useState } from "react"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { useGetTeamsInfoQuery } from "@illa-public/user-data"
import CreateTeamModal from "@/Layout/Workspace/components/CreateTeamModal"
import { findRecentTeamInfo } from "@/utils/team"

const EmptyTeamMobile = lazy(() => import("./mobile"))
const EmptyTeamPC = lazy(() => import("./pc"))

const EmptyTeam: FC = () => {
  const [createTeamVisible, setCreateTeamVisible] = useState(false)
  const openCreateModal = () => {
    setCreateTeamVisible(true)
  }
  const { data } = useGetTeamsInfoQuery(null)

  if (data && data?.length > 0) {
    const recentTeamInfo = findRecentTeamInfo(data)
    if (recentTeamInfo) {
      return <Navigate to={`/workspace/${recentTeamInfo.identifier}`} />
    } else {
      return <Navigate to={`/workspace/${data[0].identifier}`} />
    }
  }
  return (
    <>
      <LayoutAutoChange
        desktopPage={<EmptyTeamPC openCreateTeam={openCreateModal} />}
        mobilePage={<EmptyTeamMobile openCreateTeam={openCreateModal} />}
      />
      <CreateTeamModal
        visible={createTeamVisible}
        onCancel={() => setCreateTeamVisible(false)}
      />
    </>
  )
}

export default EmptyTeam
