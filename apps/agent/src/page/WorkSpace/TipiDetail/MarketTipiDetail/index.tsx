import { FC, useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"
import { useAddMarketTipiDetailTab } from "@/utils/recentTabs/hook"
import MarketTipiDetailMobile from "./mobile"
import MarketTipiDetailPC from "./pc"

const MarketTipiDetailPage: FC = () => {
  const { agentID } = useParams()
  const {
    data: aiAgentMarketPlaceInfo,
    isLoading,
    isError,
  } = useGetAIAgentMarketplaceInfoQuery({
    aiAgentID: agentID!,
  })

  const addMarketTipiDetailTab = useAddMarketTipiDetailTab()

  useEffect(() => {
    if (aiAgentMarketPlaceInfo) {
      addMarketTipiDetailTab({
        tipisID: aiAgentMarketPlaceInfo.aiAgent.aiAgentID,
        title: aiAgentMarketPlaceInfo.aiAgent.name,
        tabIcon: aiAgentMarketPlaceInfo.aiAgent.icon,
      })
    }
  }, [addMarketTipiDetailTab, aiAgentMarketPlaceInfo])

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return aiAgentMarketPlaceInfo ? (
    <LayoutAutoChange
      desktopPage={
        <MarketTipiDetailPC aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo} />
      }
      mobilePage={
        <MarketTipiDetailMobile
          aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo}
        />
      }
    />
  ) : null
}

export default MarketTipiDetailPage
