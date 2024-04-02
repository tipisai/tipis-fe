import { useMemo } from "react"
import { useMatch } from "react-router-dom"
import {
  EDIT_TIPI_TEMPLATE_PATH,
  RUN_TIPI_TEMPLATE_PATH,
  WORKSPACE_LAYOUT_PATH,
} from "@/router/constants"
import { CREATE_TIPIS_ID } from "@/utils/recentTabs/constants"

export const useGetModeAndTabID = () => {
  const runTipiMatch = useMatch(
    `${WORKSPACE_LAYOUT_PATH}/${RUN_TIPI_TEMPLATE_PATH}`,
  )
  const editTipiMatch = useMatch(
    `${WORKSPACE_LAYOUT_PATH}/${EDIT_TIPI_TEMPLATE_PATH}`,
  )

  const modeAndTabID = useMemo(() => {
    const mode: "run" | "edit" | "create" = runTipiMatch
      ? "run"
      : editTipiMatch
        ? "edit"
        : "create"
    let finalTabID = ""

    switch (mode) {
      case "run": {
        finalTabID = runTipiMatch?.params.tabID!
        break
      }
      case "edit": {
        finalTabID = editTipiMatch?.params.agentID!
        break
      }
      case "create": {
        finalTabID = CREATE_TIPIS_ID
        break
      }
    }
    return { mode, finalTabID }
  }, [editTipiMatch, runTipiMatch])

  return modeAndTabID
}
