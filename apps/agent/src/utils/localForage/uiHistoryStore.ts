import { tabStore } from "."
import { ChatMessage } from "../../components/PreviewChat/interface"

export interface IUiHistoryData {
  formData?: unknown
  chatMessage?: ChatMessage[]
  uiState?: unknown
}

export const getUiHistoryDataByCacheID = async (cacheID: string) => {
  return ((await tabStore.getItem(cacheID)) ?? {}) as IUiHistoryData
}

export const setUiHistoryData = async (
  cacheID: string,
  uiHistoryData: IUiHistoryData,
) => {
  tabStore.setItem(cacheID, uiHistoryData)
}
