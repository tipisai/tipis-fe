import { FC, useEffect } from "react"
import DetailLayout from "@/Layout/DetailLayout"
import { useAddTipisDetailTab } from "@/utils/recentTabs/hook"
import { useNavigateToExploreTipis } from "@/utils/routeHelper/hook"
import { INotContributeContentProps } from "../interface"
import PCNotContributeContent from "../module/notContributeContent/pc"

const PCNotContributeTipi: FC<INotContributeContentProps> = ({ agentInfo }) => {
  const addTipiDetailTab = useAddTipisDetailTab()
  const navigateToExploreTipis = useNavigateToExploreTipis()

  useEffect(() => {
    if (agentInfo) {
      addTipiDetailTab({
        tipisID: agentInfo.aiAgentID,
        title: agentInfo.name,
        tabIcon: agentInfo.icon,
      })
    }
  }, [addTipiDetailTab, agentInfo])

  const onClickBack = () => {
    navigateToExploreTipis()
  }

  return (
    <DetailLayout title={agentInfo.name} onClickBack={onClickBack}>
      <PCNotContributeContent agentInfo={agentInfo} />
    </DetailLayout>
  )
}

export default PCNotContributeTipi
