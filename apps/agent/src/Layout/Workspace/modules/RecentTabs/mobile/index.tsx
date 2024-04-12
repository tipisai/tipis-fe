import { FC } from "react"
import { useSelector } from "react-redux"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import MobileTipisTab from "../../../components/TipisTab/mobile"
import { recentTabsContainerStyle } from "../style"

const MobileRecentTabs: FC = () => {
  const recentTabInfos = useSelector(getRecentTabInfos)
  return (
    <div css={recentTabsContainerStyle}>
      {recentTabInfos.map((tabInfo) => (
        <MobileTipisTab
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

export default MobileRecentTabs
