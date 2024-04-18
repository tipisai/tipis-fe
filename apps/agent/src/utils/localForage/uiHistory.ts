import { klona } from "klona/json"
import { ITeamData, IUiHistoryData } from "./interface"
import { getTeamDataByTeamID, setTeamDataByTeamID } from "./teamData"

export const getUiHistoryDataByTabID = async (
  teamID: string,
  cacheID: string,
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return {}
  const uiHistory = teamData.uiHistory ?? {}
  const targetCacheID = uiHistory[cacheID]
  return targetCacheID ?? {}
}

export const setUiHistoryData = async (
  teamID: string,
  cacheID: string,
  uiHistoryData: IUiHistoryData,
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  let newTeamData = klona(teamData ?? ({} as ITeamData))
  newTeamData.uiHistory = { ...newTeamData.uiHistory, [cacheID]: uiHistoryData }
  setTeamDataByTeamID(teamID, newTeamData)
}
