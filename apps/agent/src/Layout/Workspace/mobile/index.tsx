import { FC } from "react"
import { Outlet } from "react-router-dom"
import { workspaceLayoutContainerStyle } from "./style"

export const MobileWorkspaceLayout: FC = () => {
  return (
    <div css={workspaceLayoutContainerStyle}>
      <Outlet />
    </div>
  )
}
