import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder"
import { token } from "@atlaskit/tokens"
import { RefObject, useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ITabInfo } from "@/redux/ui/recentTab/interface"
import { getRecentTabInfosOrder } from "@/redux/ui/recentTab/selector"
import { useUpdateRecentTabOrderReducer } from "@/utils/recentTabs/baseHook"
import { isTipisTabData } from "./utils"

type DraggableState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "dragging" }

const idleState: DraggableState = { type: "idle" }
const draggingState: DraggableState = { type: "dragging" }

export const useRecentTabSortableItem = (
  index: number,
  tabInfo: ITabInfo,
  ref: RefObject<HTMLAnchorElement>,
) => {
  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  useEffect(() => {
    if (!tabInfo) return
    const el = ref.current!

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({
          ...tabInfo,
        }),
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: token("space.100", "16px"),
              y: token("space.100", "8px"),
            }),
            render({ container }) {
              setDraggableState({ type: "preview", container })
              return () => setDraggableState(draggingState)
            },
          })
        },
        onDragStart() {
          setDraggableState(draggingState)
        },
        onDrop() {
          setDraggableState(idleState)
        },
      }),
      dropTargetForElements({
        element: el,
        getIsSticky: () => true,
        getData({ input }) {
          return attachClosestEdge(
            {
              ...tabInfo,
            },
            {
              element: el,
              input,
              allowedEdges: ["top", "bottom"],
            },
          )
        },
        onDrag({ self, source }) {
          const isSource = source.element === el
          if (isSource) {
            setClosestEdge(null)
            return
          }

          const closestEdge = extractClosestEdge(self.data)

          const sourceIndex = source.data.index as number

          const isItemBeforeSource = index === sourceIndex - 1
          const isItemAfterSource = index === sourceIndex + 1

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top")

          if (isDropIndicatorHidden) {
            setClosestEdge(null)
            return
          }

          setClosestEdge(closestEdge)
        },
        onDragLeave() {
          setClosestEdge(null)
        },
        onDrop() {
          setClosestEdge(null)
        },
      }),
    )
  }, [index, ref, tabInfo])

  return { closestEdge, draggableState }
}

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
        console.log("source", source)
        console.log("target", target)
        const sourceData = source.data
        const targetData = target.data

        if (!isTipisTabData(sourceData) || !isTipisTabData(targetData)) {
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
