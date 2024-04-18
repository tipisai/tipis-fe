import { FC } from "react"
import { Navigate, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import MobileContributeTipi from "./mobile/contributeTipi"
import PCContributeTipi from "./pc/contributeTipi"

const ContributeTipiDetail: FC = () => {
  const { agentID } = useParams()

  const {
    data: aiAgentMarketPlaceInfo,
    isLoading,
    isError,
  } = useGetAIAgentMarketplaceInfoQuery({
    aiAgentID: agentID!,
  })

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return aiAgentMarketPlaceInfo ? (
    <LayoutAutoChange
      desktopPage={
        <PCContributeTipi aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo} />
      }
      mobilePage={
        <MobileContributeTipi aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo} />
      }
    />
  ) : null
}

ContributeTipiDetail.displayName = "ContributeTipiDetail"

export default ContributeTipiDetail
