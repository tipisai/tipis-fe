import { FC } from "react"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetTipiContributedDetail } from "@/utils/tipis/hook"
import MobileContributeTipi from "./mobile/contributeTipi"
import PCContributeTipi from "./pc/contributeTipi"

const ContributeTipiDetail: FC = () => {
  const { contributeAgentDetail, isError, isLoading, aiAgentMarketPlaceInfo } =
    useGetTipiContributedDetail()

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }

  return contributeAgentDetail && aiAgentMarketPlaceInfo ? (
    <LayoutAutoChange
      desktopPage={
        <PCContributeTipi
          contributeAgentDetail={contributeAgentDetail}
          aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo}
        />
      }
      mobilePage={
        <MobileContributeTipi
          contributeAgentDetail={contributeAgentDetail}
          aiAgentMarketPlaceInfo={aiAgentMarketPlaceInfo}
        />
      }
    />
  ) : null
}

ContributeTipiDetail.displayName = "ContributeTipiDetail"

export default ContributeTipiDetail
