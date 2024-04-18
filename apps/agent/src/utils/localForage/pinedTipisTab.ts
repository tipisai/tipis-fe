import { klona } from "klona/json"
import { IPinedTipiTabInfo } from "@/redux/ui/pinedTipis/interface"
import { ITeamData } from "./interface"
import { getTeamDataByTeamID, setTeamDataByTeamID } from "./teamData"

export const getPinedTipisTabs = async (teamID: string) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) {
    return []
  }
  const tabsInfo = teamData.pinedTipisTabInfo ?? []
  return tabsInfo
}

export const setPinedTipisTabs = async (
  teamID: string,
  pinedTipiTabInfos: IPinedTipiTabInfo[],
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  let newTeamData = klona(teamData ?? ({} as ITeamData))
  newTeamData.pinedTipisTabInfo = pinedTipiTabInfos
  setTeamDataByTeamID(teamID, newTeamData)
}

export const addPinedTipisTabs = async (
  teamID: string,
  pinedTipiTabInfo: IPinedTipiTabInfo,
) => {
  const tabs = await getPinedTipisTabs(teamID)
  const newTabs = [pinedTipiTabInfo, ...tabs]
  await setPinedTipisTabs(teamID, newTabs)
}

export const removePinedTipisTabsByTabID = async (
  teamID: string,
  tabID: string,
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return
  const tabs = teamData.pinedTipisTabInfo ?? []
  const newTabs = tabs.filter((tab) => tab.tabID !== tabID)
  const newTeamData = klona(teamData)
  newTeamData.pinedTipisTabInfo = newTabs
  setTeamDataByTeamID(teamID, newTeamData)
}

export const removePinedTipisTabsByTipisID = async (
  teamID: string,
  tipisID: string,
) => {
  const teamData = await getTeamDataByTeamID(teamID)
  if (!teamData) return
  const tabs = teamData.pinedTipisTabInfo ?? []
  const newTabs = tabs.filter((tab) => tab.tipiID !== tipisID)
  const newTeamData = klona(teamData)
  newTeamData.pinedTipisTabInfo = newTabs
  setTeamDataByTeamID(teamID, newTeamData)
}

export const batchUpdatePinedTipisTabs = async (
  teamID: string,
  oldTipiIDMapTabInfos: Record<string, Partial<IPinedTipiTabInfo>>,
) => {
  const tabs = await getPinedTipisTabs(teamID)
  const newTabs = tabs.map((tab) => {
    if (oldTipiIDMapTabInfos[tab.tipiID]) {
      return {
        ...tab,
        ...oldTipiIDMapTabInfos[tab.tipiID],
      }
    }
    return tab
  })
  await setPinedTipisTabs(teamID, newTabs)
}

export const getTeamIDMapPinedTipisTabs = async (teamIDs: string[]) => {
  const teamIDMapPinedTipisTabs: Record<string, IPinedTipiTabInfo[]> = {}
  for (const teamID of teamIDs) {
    teamIDMapPinedTipisTabs[teamID] = await getPinedTipisTabs(teamID)
  }
  return teamIDMapPinedTipisTabs
}
