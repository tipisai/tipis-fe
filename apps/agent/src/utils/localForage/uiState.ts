import { klona } from "klona/json"
import { ChatMessage, IGroupMessage } from "@/components/PreviewChat/interface"
import { getUiHistoryDataByTabID, setUiHistoryData } from "./uiHistory"

export const getCacheUIState = async (teamID: string, tabID: string) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  return uiHistoryCacheData.uiState
}
export const setCacheUIState = async (
  teamID: string,
  tabID: string,
  uiState: unknown,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.uiState = uiState
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const getChatMessageAndUIState = async (
  teamID: string,
  tabID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const chatMessageData = uiHistoryCacheData.chatMessage ?? []
  const uiChatMessage = uiHistoryCacheData.uiState ?? []

  return { chatMessageData, uiChatMessage }
}

export const setChatMessageAndUIState = async (
  teamID: string,
  tabID: string,
  uiChatMessage: (IGroupMessage | ChatMessage)[],
  chatMessageData: unknown[],
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.chatMessage = chatMessageData
  newUIHistoryCacheData.uiState = uiChatMessage
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}

export const removeChatMessageAndUIState = async (
  teamID: string,
  tabID: string,
) => {
  const uiHistoryCacheData = await getUiHistoryDataByTabID(teamID, tabID)
  const newUIHistoryCacheData = klona(uiHistoryCacheData ?? {})
  newUIHistoryCacheData.chatMessage = []
  newUIHistoryCacheData.uiState = []
  await setUiHistoryData(teamID, tabID, newUIHistoryCacheData)
}
