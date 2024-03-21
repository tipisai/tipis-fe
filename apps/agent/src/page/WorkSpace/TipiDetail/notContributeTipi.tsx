import { FC } from "react"
import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import DetailHeader from "@/Layout/DetailLayout/components/DetailHeader"
import FullSectionLoading from "@/components/FullSectionLoading"
import { getExploreTipisPath } from "@/utils/routeHelper"
import { useGetNotContributeTipDetail } from "@/utils/tipis/hook"
import ActionGroup from "./components/ActionGroup"
import Parameters from "./components/Parameters"
import Prompt from "./components/Prompt"

const NotContributeTipiDetail: FC = () => {
  const { data, isLoading, isError } = useGetNotContributeTipDetail()

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
  return data ? (
    <DetailLayout title={data.name} onClickBack={onClickBack}>
      <DetailHeader
        avatarURL={data.icon}
        title={data.name}
        description={data.description}
      />
      <ActionGroup isContribute={false} />
      <Prompt parameters={data.variables ?? []} prompt={data.prompt} />
      <Parameters parameters={data.variables ?? []} />
    </DetailLayout>
  ) : null
}

NotContributeTipiDetail.displayName = "NotContributeTipiDetail"

export default NotContributeTipiDetail
