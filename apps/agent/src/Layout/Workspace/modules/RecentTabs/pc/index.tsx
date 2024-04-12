import { FC } from "react"
import { useSelector } from "react-redux"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import PCTipisTab from "../../../components/TipisTab/pc"
import { recentTabsContainerStyle } from "../style"

const PCRecentTabs: FC<{ isMiniSize: boolean }> = ({ isMiniSize = false }) => {
  const recentTabInfos = useSelector(getRecentTabInfos)
  return (
    <div css={recentTabsContainerStyle}>
      {recentTabInfos.map((tabInfo) => (
        <PCTipisTab
          tabID={tabInfo.tabID}
          tabType={tabInfo.tabType}
          tabName={tabInfo.tabName}
          icon={tabInfo.tabIcon}
          key={tabInfo.tabID}
          cacheID={tabInfo.cacheID}
          isMiniSize={isMiniSize}
        />
      ))}
    </div>
  )
}

export default PCRecentTabs
