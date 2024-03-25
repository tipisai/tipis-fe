import { FC, useContext } from "react"
import { Outlet } from "react-router-dom"
import { useInitRecentTab } from "@/utils/recentTabs/hook"
import PCWorkspaceMenu from "./modules/Menu"
import MiniMenu from "./modules/Menu/MiniMenu"
import {
  MenuStatusUIContext,
  MenuStatusUIProvider,
} from "./modules/Menu/context"
import { contentContainerStyle, workspaceLayoutContainerStyle } from "./style"

const PCWorkspaceLayout: FC = () => {
  const { collapsed } = useContext(MenuStatusUIContext)
  return (
    <div css={workspaceLayoutContainerStyle}>
      {collapsed ? <MiniMenu /> : <PCWorkspaceMenu />}
      <section css={contentContainerStyle}>
        <Outlet />
      </section>
    </div>
  )
}

const PCWorkspaceWithMenuLayout: FC = () => {
  useInitRecentTab()
  return (
    <MenuStatusUIProvider>
      <PCWorkspaceLayout />
    </MenuStatusUIProvider>
  )
}

export default PCWorkspaceWithMenuLayout
