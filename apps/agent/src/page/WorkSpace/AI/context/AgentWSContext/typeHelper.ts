import { ChatMessage, IGroupMessage } from "@/components/PreviewChat/interface"

export const isGroupMessage = (
  messageItem: IGroupMessage | ChatMessage,
): messageItem is IGroupMessage => {
  return "items" in messageItem && Array.isArray(messageItem.items)
}

export const isNormalMessage = (
  messageItem: IGroupMessage | ChatMessage,
): messageItem is ChatMessage => {
  return !("items" in messageItem)
}
