import { FC, useCallback, useEffect } from "react"
import { useBeforeUnload } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import { CreateTeamContextProvider } from "./context"
import MobileWorkspaceLayout from "./mobile"
import PCWorkspaceLayout from "./pc"

const WorkspaceLayout: FC = () => {
  const trackLeave = useCallback(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.HOMEPAGE)
  }, [])

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.HOMEPAGE)

    return () => {
      trackLeave()
    }
  }, [trackLeave])

  useBeforeUnload(trackLeave)

  return (
    <CreateTeamContextProvider>
      <LayoutAutoChange
        desktopPage={<PCWorkspaceLayout />}
        mobilePage={<MobileWorkspaceLayout />}
      />
    </CreateTeamContextProvider>
  )
}

export default WorkspaceLayout
