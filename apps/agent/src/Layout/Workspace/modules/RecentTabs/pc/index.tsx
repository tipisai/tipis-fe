import { FC } from "react"
import { useSelector } from "react-redux"
import { getRecentTabInfosOrder } from "@/redux/ui/recentTab/selector"
import PCTipisTab from "../../../components/Tab/TipisTab/pc"
import { useMonitorRecentTabSort } from "../hook"
import { recentTabsContainerStyle } from "../style"

const PCRecentTabs: FC<{ isMiniSize: boolean }> = ({ isMiniSize = false }) => {
  const tabOrders = useSelector(getRecentTabInfosOrder)

  useMonitorRecentTabSort()

  return (
    <div css={recentTabsContainerStyle}>
      {tabOrders.map((tabID, index) => (
        <PCTipisTab
          tabID={tabID}
          key={tabID}
          isMiniSize={isMiniSize}
          index={index}
        />
      ))}
    </div>
  )
}

export default PCRecentTabs
