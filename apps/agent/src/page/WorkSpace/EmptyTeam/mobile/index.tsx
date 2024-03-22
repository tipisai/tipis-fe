import { FC } from "react"
import EmptyPageLayoutMobile from "@/Layout/Workspace/mobile/module/EmptyPageLayout"
import { EmptyTeamProps } from "../interface"

const EmptyTeamMobile: FC<EmptyTeamProps> = ({ openCreateTeam }) => {
  return (
    <EmptyPageLayoutMobile openCreateModal={openCreateTeam} title="empty team">
      <div>empty team</div>
    </EmptyPageLayoutMobile>
  )
}

export default EmptyTeamMobile
