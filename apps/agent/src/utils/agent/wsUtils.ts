import { isPremiumModel } from "@illa-public/market-agent"
import { IKnowledgeFile } from "@illa-public/public-types"
import { ErrorCode } from "@/api/ws/textSignal"
import {
  ChatMessage,
  ChatSendRequestPayload,
  IGroupMessage,
  MESSAGE_STATUS,
  MESSAGE_SYNC_TYPE,
} from "@/components/PreviewChat/interface"
import { SPLIT_MESSAGE } from "./constants"
import { isGroupMessage } from "./typeHelper"

export const formatMessageString = (
  text: string,
  knowledgeFiles?: IKnowledgeFile[],
) => {
  let res = text
  if (!knowledgeFiles || knowledgeFiles.length === 0) return res
  const fileString = knowledgeFiles
    .map((file) => {
      return `File name: [${file.fileName}]\nFile content: [\n${file.value}\n]
    `
    })
    .join("\n\n")

  return `${res}\n${fileString}`
}

export const formatSendMessagePayload = (
  payload: ChatSendRequestPayload,
  messageContent?: ChatMessage,
) => {
  const encodePayload: ChatSendRequestPayload = payload

  Object.keys(encodePayload).forEach((key) => {
    if (key === "prompt") {
      const text = encodePayload[key]
      if (isPremiumModel(payload.model)) {
        encodePayload[key] = encodeURIComponent(
          formatMessageString(text, messageContent?.knowledgeFiles),
        )
      } else {
        encodePayload[key] = encodeURIComponent(encodePayload[key])
      }
    }
    if (key === "variables") {
      encodePayload[key] = encodePayload[key].map((v) => {
        return {
          ...v,
          value: encodeURIComponent(v.value),
        }
      })
    }
  })
  return encodePayload
}

export const handleUpdateMessageList = (
  curMessage: IGroupMessage,
  message: ChatMessage,
  code?: ErrorCode,
) => {
  const needUpdateMessage = curMessage.items[curMessage.items.length - 1]
  if (code === ErrorCode.ERROR_CHAT_BUBBLE_END) {
    curMessage.items.push(SPLIT_MESSAGE)
  } else if (needUpdateMessage.messageType === message.messageType) {
    needUpdateMessage.message = needUpdateMessage.message + message.message
  } else {
    if (
      message.messageType ===
        MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_ERROR ||
      message.messageType ===
        MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_OK
    ) {
      markAnalyzeMessageEnd(curMessage.items)
    }
    curMessage.items.push(message)
  }
}

export const markAnalyzeMessageEnd = (messageList: ChatMessage[]) => {
  messageList.forEach((message) => {
    if (
      message.messageType ===
        MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST &&
      message.status === MESSAGE_STATUS.ANALYZE_PENDING
    ) {
      message.status = MESSAGE_STATUS.ANALYZE_END
    }
  })
}

export const cancelPendingMessage = (
  messageList: (IGroupMessage | ChatMessage)[],
) => {
  let needUpdateMessageList = false
  const cancelUpdateList = messageList.map((message) => {
    if (
      isGroupMessage(message) &&
      message.items.some(
        (messageItem) =>
          messageItem.messageType ===
            MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST &&
          messageItem.status === MESSAGE_STATUS.ANALYZE_PENDING,
      )
    ) {
      let updateMessageItem = message.items.map((messageItem) => {
        if (
          messageItem.messageType ===
            MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST &&
          messageItem.status === MESSAGE_STATUS.ANALYZE_PENDING
        ) {
          needUpdateMessageList = true
          return {
            ...messageItem,
            status: MESSAGE_STATUS.ANALYZE_STOP,
          }
        }
        return messageItem
      })
      return {
        ...message,
        items: updateMessageItem,
      }
    }
    return message
  })

  return needUpdateMessageList ? cancelUpdateList : undefined
}
