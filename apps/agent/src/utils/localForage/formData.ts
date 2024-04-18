import { klona } from "klona/json"
import { getUiHistoryDataByTabID, setUiHistoryData } from "./uiHistory"

export const getFormDataByTabID = async (teamID: string, tabID: string) => {
  const uiHistoryData = await getUiHistoryDataByTabID(teamID, tabID)
  return uiHistoryData.formData
}

export const setFormDataByTabID = async (
  teamID: string,
  tabID: string,
  formData: unknown,
) => {
  const uiHistoryData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUiHistoryData = klona(uiHistoryData ?? {})
  newUiHistoryData.formData = formData
  await setUiHistoryData(teamID, tabID, newUiHistoryData)
}

export const deleteFormDataByTabID = async (teamID: string, tabID: string) => {
  const uiHistoryData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUiHistoryData = klona(uiHistoryData ?? {})
  delete newUiHistoryData.formData
  await setUiHistoryData(teamID, tabID, newUiHistoryData)
}
