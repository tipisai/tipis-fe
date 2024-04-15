import { FC } from "react"
import { useSelector } from "react-redux"
import { getRecentTabInfosOrder } from "@/redux/ui/recentTab/selector"
// import { recentTabActions } from "../../../../../redux/ui/recentTab/slice"
import PCTipisTab from "../../../components/TipisTab/pc"
import { recentTabsContainerStyle } from "../style"

const PCRecentTabs: FC<{ isMiniSize: boolean }> = ({ isMiniSize = false }) => {
  const tabOrders = useSelector(getRecentTabInfosOrder)

  // const dispatch = useDispatch()
  // const onReorder = useCallback(
  //   (newOrder: string[]) => {
  //     console.log("newOrder", newOrder)
  //     dispatch(recentTabActions.updateCurrentRecentTabOrderReducer(newOrder))
  //   },
  //   [dispatch],
  // )

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
