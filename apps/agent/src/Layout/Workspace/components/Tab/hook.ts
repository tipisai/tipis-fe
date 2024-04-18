import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview"
import { RefObject, useEffect, useState } from "react"

type DraggableState =
  | { type: "idle" }
  | { type: "preview" }
  | { type: "dragging" }

const idleState: DraggableState = { type: "idle" }
const draggingState: DraggableState = { type: "dragging" }

export enum DRAG_TAB_TYPES {
  COMMON_TAB = "common-tab",
  PINED_TAB = "pined-tab",
}

export const useTabSortableItem = (
  index: number,
  draggedData: Record<string, unknown> | undefined,
  dragType: DRAG_TAB_TYPES,
  ref: RefObject<HTMLElement>,
) => {
  const [draggableState, setDraggableState] =
    useState<DraggableState>(idleState)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  useEffect(() => {
    if (!draggedData) return
    const el = ref.current!

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({
          ...draggedData,
        }),
        onGenerateDragPreview({ nativeSetDragImage }) {
          disableNativeDragPreview({ nativeSetDragImage })
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
        canDrop: ({ element, source }) => {
          const canDropType = element.getAttribute("data-can-drop-type")
          const sourceCanDropType =
            source.element.getAttribute("data-can-drop-type")
          return canDropType === dragType && sourceCanDropType === dragType
        },
        getData({ input }) {
          return attachClosestEdge(
            {
              ...draggedData,
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
  }, [dragType, draggedData, index, ref])

  return { closestEdge, draggableState }
}
