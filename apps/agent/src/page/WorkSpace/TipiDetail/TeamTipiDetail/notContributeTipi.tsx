import { FC, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { v4 } from "uuid"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import DetailLayout from "@/Layout/DetailLayout"
import DetailHeader from "@/Layout/DetailLayout/components/DetailHeader"
import FullSectionLoading from "@/components/FullSectionLoading"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCurrentTabID,
  getRecentTabInfos,
} from "@/redux/ui/recentTab/selector"
import { recentTabActions } from "@/redux/ui/recentTab/slice"
import {
  useAddRecentTabReducer,
  useUpdateRecentTabReducer,
} from "@/utils/recentTabs/baseHook"
import { useAddTipisDetailTab } from "@/utils/recentTabs/hook"
import { getExploreTipisPath } from "@/utils/routeHelper"
import { useGetNotContributeTipDetail } from "@/utils/tipis/hook"
import ActionGroup from "../components/ActionGroup"
import Parameters from "../components/Parameters"
import Prompt from "../components/Prompt"

const NotContributeTipiDetail: FC = () => {
  const { data, isLoading, isError } = useGetNotContributeTipDetail()

  const navigate = useNavigate()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const dispatch = useDispatch()
  const updateRecentTab = useUpdateRecentTabReducer()
  const addRecentTab = useAddRecentTabReducer()

  const addTipiDetailTab = useAddTipisDetailTab()

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
    const currentTabID = getCurrentTabID(store.getState())
    const recentTabs = getRecentTabInfos(store.getState())
    const currentTab = recentTabs.find((tab) => tab.tabID === currentTabID)
    const cacheID = v4()
    const newTab = {
      ...currentTab,
      tabName: "",
      tabIcon: "",
      tabType: TAB_TYPE.EXPLORE_TIPIS,
      tabID: cacheID,
      cacheID: cacheID,
    }
    if (currentTab) {
      updateRecentTab(currentTabID, newTab)

      dispatch(recentTabActions.updateCurrentRecentTabIDReducer(cacheID))
    } else {
      addRecentTab(newTab)
    }
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
