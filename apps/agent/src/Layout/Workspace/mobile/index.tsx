import { FC, useState } from "react"
import { Outlet } from "react-router-dom"
import { useInitRecentTab } from "@/utils/recentTabs/baseHook"
import CreateTeamModal from "../components/CreateTeamModal"
import { workspaceLayoutContainerStyle } from "./style"

const MobileWorkspaceLayout: FC = () => {
  useInitRecentTab()
  const [createTeamVisible, setCreateTeamVisible] = useState(false)

  return (
    <>
      <div css={workspaceLayoutContainerStyle}>
        <Outlet
          context={{
            onChangeTeamVisible: setCreateTeamVisible,
          }}
        />
      </div>
      <CreateTeamModal
        visible={createTeamVisible}
        onCancel={() => setCreateTeamVisible(false)}
      />
    </>
  )
}

export default MobileWorkspaceLayout
