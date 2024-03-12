import { FC } from "react"
import { Outlet } from "react-router-dom"
import PCWorkspaceMenu from "./modules/Menu"
import { contentContainerStyle, workspaceLayoutContainerStyle } from "./style"

const PCWorkspaceLayout: FC = () => {
  return (
    <div css={workspaceLayoutContainerStyle}>
      <PCWorkspaceMenu />
      <section css={contentContainerStyle}>
        <Outlet />
      </section>
    </div>
  )
}

export default PCWorkspaceLayout
