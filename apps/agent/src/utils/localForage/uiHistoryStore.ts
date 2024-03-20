import { uiHistoryDataStore } from "."
import { ChatMessage } from "../../components/PreviewChat/interface"

export interface IUiHistoryData {
  formData?: unknown
  chatMessage?: ChatMessage[]
  uiState?: unknown
}

export const getUiHistoryDataByCacheID = async (cacheID: string) => {
  return ((await uiHistoryDataStore.getItem(cacheID)) ?? {}) as IUiHistoryData
}

export const setUiHistoryData = (
  cacheID: string,
  uiHistoryData: IUiHistoryData,
) => {
  uiHistoryDataStore.setItem(cacheID, uiHistoryData)
}

export const deleteUiHistoryData = (cacheID: string) => {
  uiHistoryDataStore.removeItem(cacheID)
}

export const updateUiHistoryData = async (
  oldCacheID: string,
  newCacheID: string,
  uiHistoryData: IUiHistoryData,
) => {
  const oldData = (await getUiHistoryDataByCacheID(oldCacheID)) ?? {}
  setUiHistoryData(newCacheID, { ...oldData, ...uiHistoryData })
  deleteUiHistoryData(oldCacheID)
}
