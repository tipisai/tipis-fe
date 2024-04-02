import { FC, useEffect } from "react"
import { Navigate } from "react-router-dom"
import DetailLayout from "@/Layout/DetailLayout"
import DetailHeader from "@/Layout/DetailLayout/components/DetailHeader"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useAddTipisDetailTab } from "@/utils/recentTabs/hook"
import { useNavigateToExploreTipis } from "@/utils/routeHelper/hook"
import { useGetNotContributeTipDetail } from "@/utils/tipis/hook"
import ActionGroup from "../components/ActionGroup"
import Knowledge from "../components/Knowledge"
import Parameters from "../components/Parameters"
import Prompt from "../components/Prompt"

const NotContributeTipiDetail: FC = () => {
  const { data, isLoading, isError } = useGetNotContributeTipDetail()

  const addTipiDetailTab = useAddTipisDetailTab()
  const navigateToExploreTipis = useNavigateToExploreTipis()

  useEffect(() => {
    if (data) {
      addTipiDetailTab({
        tipisID: data.aiAgentID,
        title: data.name,
        tabIcon: data.icon,
      })
    }
  }, [addTipiDetailTab, data])

  const onClickBack = () => {
    navigateToExploreTipis()
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
      <ActionGroup
        isContribute={false}
        tipisName={data.name}
        tipisID={data.aiAgentID}
        tipisIcon={data.icon}
      />
      <Prompt parameters={data.variables ?? []} prompt={data.prompt} />
      <Parameters parameters={data.variables ?? []} />
      <Knowledge knowledge={data.knowledge ?? []} />
    </DetailLayout>
  ) : null
}

NotContributeTipiDetail.displayName = "NotContributeTipiDetail"

export default NotContributeTipiDetail
