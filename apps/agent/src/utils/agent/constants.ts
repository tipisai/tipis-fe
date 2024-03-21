import {
  ChatMessage,
  MESSAGE_SYNC_TYPE,
  SenderType,
} from "@/components/PreviewChat/interface"

export const SPLIT_MESSAGE: ChatMessage = {
  threadID: "",
  message: "",
  sender: {
    senderID: "",
    senderType: SenderType.ANONYMOUS_AGENT,
  },
  messageType: MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_CHAT,
  knowledgeFiles: [],
}
