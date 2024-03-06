import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { FC } from "react"
import { Navigate, useParams } from "react-router-dom"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetContributedAgentDetailQuery } from "@/redux/services/agentAPI"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import AIAgentRunMobile from "./AIAgentRunMobile"
import AIAgentRunPC from "./AIAgentRunPC"

export const ContributedAgent: FC = () => {
  const { agentID, ownerTeamIdentifier } = useParams()

  const {
    data: contributeAgentDetail,
    isLoading: isGetContributedAgentDetailLoading,
    isError: isGetContributedAgentDetailError,
  } = useGetContributedAgentDetailQuery({
    aiAgentID: agentID!,
    ownerTeamIdentifier: ownerTeamIdentifier!,
  })

  const {
    data: aiAgentMarketPlaceInfo,
    isLoading: isGetAIAgentMarketplaceInfoLoading,
    isError: isGetAIAgentMarketplaceInfoError,
  } = useGetAIAgentMarketplaceInfoQuery({
    aiAgentID: agentID!,
  })

  const mixedIsLoading =
    isGetContributedAgentDetailLoading || isGetAIAgentMarketplaceInfoLoading
  const mixedIsError =
    isGetContributedAgentDetailError || isGetAIAgentMarketplaceInfoError

  if (mixedIsLoading) {
    return <FullSectionLoading />
  }

  if (mixedIsError) {
    return <Navigate to="/404" />
  }

  return contributeAgentDetail && aiAgentMarketPlaceInfo ? (
    <LayoutAutoChange
      desktopPage={
        <AIAgentRunPC
          agent={contributeAgentDetail}
          marketplace={aiAgentMarketPlaceInfo}
        />
      }
      mobilePage={
        <AIAgentRunMobile
          agent={contributeAgentDetail}
          marketplace={aiAgentMarketPlaceInfo}
        />
      }
    />
  ) : null
}
