import { FC } from "react"
import { useSelector } from "react-redux"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import TipisTab from "../../components/TipisTab"
import { recentTabsContainerStyle } from "./style"

const RecentTabs: FC = () => {
  const recentTabInfos = useSelector(getRecentTabInfos)
  return (
    <div css={recentTabsContainerStyle}>
      {recentTabInfos.map((tabInfo) => (
        <TipisTab
          tabID={tabInfo.tabID}
          tabType={tabInfo.tabType}
          tabName={tabInfo.tabName}
          icon={tabInfo.tabIcon}
          key={tabInfo.tabID}
          cacheID={tabInfo.cacheID}
        />
      ))}
    </div>
  )
}

export default RecentTabs
