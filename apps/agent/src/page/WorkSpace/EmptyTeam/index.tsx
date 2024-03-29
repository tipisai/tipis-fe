import { FC, useState } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import CreateTeamModal from "@/Layout/Workspace/components/CreateTeamModal"
import EmptyTeamMobile from "./mobile"
import EmptyTeamPC from "./pc"

const EmptyTeam: FC = () => {
  const [createTeamVisible, setCreateTeamVisible] = useState(false)
  const openCreateModal = () => {
    setCreateTeamVisible(true)
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
