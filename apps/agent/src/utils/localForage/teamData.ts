import { teamDataDataBase } from "."
import { ITeamData } from "./interface"

export const getTeamDataByTeamID = async (teamID: string) => {
  return await teamDataDataBase.getItem<ITeamData>(teamID)
}

export const setTeamDataByTeamID = (teamID: string, teamData: ITeamData) => {
  teamDataDataBase.setItem(teamID, teamData)
}

export const getRecentTabInfosAndPinedTabInfos = async (teamID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return { recentTabInfos: [], pinedTabInfos: [] }
  const recentTabInfos = teamData.tabsInfo ?? []
  const pinedTabInfos = teamData.pinedTipisTabInfo ?? []
  return { recentTabInfos, pinedTabInfos }
}
