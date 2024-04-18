import {
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { getRecentTabInfosOrder } from "@/redux/ui/recentTab/selector"
import { useUpdateRecentTabOrderReducer } from "@/utils/recentTabs/baseHook"
import { DRAG_TAB_TYPES } from "../../components/Tab/hook"

export const useMonitorRecentTabSort = () => {
  const updateRecentTabOrderReducer = useUpdateRecentTabOrderReducer()
  const tabOrders = useSelector(getRecentTabInfosOrder)

  const reorderItem = useCallback(
    ({
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    }: {
      startIndex: number
      indexOfTarget: number
      closestEdgeOfTarget: Edge | null
    }) => {
      const finishIndex = getReorderDestinationIndex({
        startIndex,
        closestEdgeOfTarget,
        indexOfTarget,
        axis: "vertical",
      })

      if (finishIndex === startIndex) {
        return
      }

      const reorderResult = reorder({
        list: tabOrders,
        startIndex,
        finishIndex,
      })
      updateRecentTabOrderReducer(reorderResult)
    },
    [tabOrders, updateRecentTabOrderReducer],
  )

  useEffect(() => {
    return monitorForElements({
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0]
        if (!target) {
          return
        }
        const sourceData = source.data
        const targetData = target.data

        const targetCanDropType =
          target.element.getAttribute("data-can-drop-type")
        const sourceCanDropType =
          source.element.getAttribute("data-can-drop-type")

        if (
          targetCanDropType !== DRAG_TAB_TYPES.COMMON_TAB ||
          sourceCanDropType !== DRAG_TAB_TYPES.COMMON_TAB
        ) {
          return
        }

        const indexOfTarget = tabOrders.findIndex(
          (item) => item === targetData.tabID,
        )
        const indexOfSource = tabOrders.findIndex(
          (item) => item === sourceData.tabID,
        )

        if (indexOfTarget < 0 || indexOfSource < 0) {
          return
        }

        const closestEdgeOfTarget = extractClosestEdge(targetData)

        reorderItem({
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget,
        })
      },
    })
  }, [reorderItem, tabOrders])
}
