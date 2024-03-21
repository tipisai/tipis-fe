import { FC } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import ContributeInfo from "@/Layout/DetailLayout/components/ContributeInfo"
import DetailHeader from "@/Layout/DetailLayout/components/DetailHeader"
import FullSectionLoading from "@/components/FullSectionLoading"
import { getExploreTipisPath } from "@/utils/routeHelper"
import { useGetTipiContributedDetail } from "@/utils/tipis/hook"
import ActionGroup from "./components/ActionGroup"
import Parameters from "./components/Parameters"
import Prompt from "./components/Prompt"

const ContributeTipiDetail: FC = () => {
  const { contributeAgentDetail, isError, isLoading, aiAgentMarketPlaceInfo } =
    useGetTipiContributedDetail()
  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!

  const onClickBack = () => {
    navigate(getExploreTipisPath(currentTeamInfo.identifier))
  }

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (isError) {
    return <Navigate to="/404" />
  }
  return contributeAgentDetail && aiAgentMarketPlaceInfo ? (
    <DetailLayout title={contributeAgentDetail?.name} onClickBack={onClickBack}>
      <DetailHeader
        avatarURL={contributeAgentDetail.icon}
        title={contributeAgentDetail.name}
        description={contributeAgentDetail.description}
      />
      <ActionGroup
        isContribute
        runNumber={aiAgentMarketPlaceInfo.marketplace.numRuns}
        forkNumber={aiAgentMarketPlaceInfo.marketplace.numForks}
        starNumber={aiAgentMarketPlaceInfo.marketplace.numStars}
      />
      <ContributeInfo
        teamName={aiAgentMarketPlaceInfo.marketplace.contributorTeam.name}
        teamAvatar={aiAgentMarketPlaceInfo.marketplace.contributorTeam.icon}
        contributorAvatars={contributeAgentDetail.editedBy.map(
          (item) => item.avatar,
        )}
      />
      <Prompt
        parameters={contributeAgentDetail.variables ?? []}
        prompt={contributeAgentDetail.prompt}
      />
      <Parameters parameters={contributeAgentDetail.variables ?? []} />
    </DetailLayout>
  ) : null
}

ContributeTipiDetail.displayName = "ContributeTipiDetail"

export default ContributeTipiDetail
