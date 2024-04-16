import { FC } from "react"
import { useSelector } from "react-redux"
import { getRecentTabInfosOrder } from "@/redux/ui/recentTab/selector"
import MobileTipisTab from "../../../components/TipisTab/mobile"
import { recentTabsContainerStyle } from "../style"

const MobileRecentTabs: FC = () => {
  const tabOrders = useSelector(getRecentTabInfosOrder)

  return (
    <div css={recentTabsContainerStyle}>
      {tabOrders.map((tabID, index) => (
        <MobileTipisTab tabID={tabID} key={tabID} index={index} />
      ))}
    </div>
  )
}

export default MobileRecentTabs
