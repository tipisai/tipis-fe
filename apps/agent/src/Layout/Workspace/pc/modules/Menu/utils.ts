import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/types"
import {
  COMMON_MENU_DIVIDER_DEFAULT_HEIGHT,
  COMMON_MENU_PINED_AREA_HEADER_HEIGHT,
  COMMON_MENU_PINED_AREA_MIN_HEIGHT,
  MINI_MENU_DIVIDER_HEIGHT,
  MINI_MENU_PINED_AREA_MIN_HEIGHT,
  RECENT_TAB_AREA_MIN_HEIGHT,
} from "../../config"

export function getProposedHeight({
  initialHeight,
  location,
  tabAreaHeight,
  isMiniSize,
}: {
  initialHeight: number
  location: DragLocationHistory
  tabAreaHeight: number
  isMiniSize: boolean
}): number {
  const diffY = location.current.input.clientY - location.initial.input.clientY
  const proposedHeight = initialHeight + diffY
  const resetMinHeight = isMiniSize
    ? COMMON_MENU_PINED_AREA_HEADER_HEIGHT +
      MINI_MENU_DIVIDER_HEIGHT +
      RECENT_TAB_AREA_MIN_HEIGHT
    : COMMON_MENU_DIVIDER_DEFAULT_HEIGHT +
      RECENT_TAB_AREA_MIN_HEIGHT +
      COMMON_MENU_PINED_AREA_HEADER_HEIGHT
  const maxAllowedHeight = tabAreaHeight - resetMinHeight
  const minHeight = isMiniSize
    ? MINI_MENU_PINED_AREA_MIN_HEIGHT
    : COMMON_MENU_PINED_AREA_MIN_HEIGHT

  return Math.min(Math.max(minHeight, proposedHeight), maxAllowedHeight)
}
