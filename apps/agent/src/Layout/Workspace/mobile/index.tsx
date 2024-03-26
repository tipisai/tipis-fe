import { FC } from "react"
import { Outlet } from "react-router-dom"
import { useInitRecentTab } from "@/utils/recentTabs/hook"
import { workspaceLayoutContainerStyle } from "./style"

export const MobileWorkspaceLayout: FC = () => {
  useInitRecentTab()

  return (
    <div css={workspaceLayoutContainerStyle}>
      <Outlet />
    </div>
  )
}
