import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { getCurrentId } from "@illa-public/user-data"
import { FC } from "react"
import { useSelector } from "react-redux"
import { Navigate, useParams } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAgentDetailQuery } from "@/redux/services/agentAPI"
import AIAgentRunMobile from "./AIAgentRunMobile"
import AIAgentRunPC from "./AIAgentRunPC"

export const NotContributedAgent: FC = () => {
  const currentTeamID = useSelector(getCurrentId)
  const { agentID } = useParams()

  const { data, isLoading, isError } = useGetAgentDetailQuery({
    aiAgentID: agentID!,
    teamID: currentTeamID!,
  })

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return data ? (
    <LayoutAutoChange
      desktopPage={<AIAgentRunPC agent={data} marketplace={undefined} />}
      mobilePage={<AIAgentRunMobile agent={data} marketplace={undefined} />}
    />
  ) : null
}
