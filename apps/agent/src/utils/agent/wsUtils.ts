import { isPremiumModel } from "@illa-public/market-agent"
import { IKnowledgeFile } from "@illa-public/public-types"
import {
  ChatMessage,
  ChatSendRequestPayload,
  ChatWsAppendResponse,
  IGroupMessage,
  MESSAGE_STATUS,
  MESSAGE_SYNC_TYPE,
} from "@/components/PreviewChat/interface"
import {
  getEditCacheChatMessage,
  getRunCacheChatMessage,
  setEditCacheChatMessage,
  setRunCacheChatMessage,
} from "../localForage/teamData"
import { isGroupMessage, isNormalMessage } from "./typeHelper"

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

export const isChatMessage = (message: ChatMessage) => {
  return message.messageType === MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_CHAT
}

export const isRequestMessage = (message: ChatMessage) => {
  return (
    message.messageType === MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST
  )
}

export const isPendingRequestMessage = (message: ChatMessage) => {
  return (
    isRequestMessage(message) &&
    message.status == MESSAGE_STATUS.ANALYZE_PENDING
  )
}
export const isErrorMessageRes = (message: ChatMessage) => {
  return (
    message.messageType ===
    MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_ERROR
  )
}

export const isSuccessMessageRes = (message: ChatMessage) => {
  return (
    message.messageType ===
    MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_OK
  )
}

export const handleUpdateMessageList = (
  curMessage: IGroupMessage,
  message: ChatMessage,
) => {
  const needUpdateMessage = curMessage.items[curMessage.items.length - 1]
  if (needUpdateMessage.messageType === message.messageType) {
    needUpdateMessage.message = needUpdateMessage.message + message.message
  } else {
    if (
      isPendingRequestMessage(needUpdateMessage) &&
      (isErrorMessageRes(message) || isSuccessMessageRes(message))
    ) {
      needUpdateMessage.status = isErrorMessageRes(message)
        ? MESSAGE_STATUS.ANALYZE_FAILED
        : MESSAGE_STATUS.ANALYZE_SUCCESS
    }
    if (!isErrorMessageRes(message) && !isSuccessMessageRes(message)) {
      curMessage.items.push({
        ...message,
        status: isRequestMessage(message)
          ? MESSAGE_STATUS.ANALYZE_PENDING
          : undefined,
      })
    }
  }
}

export const markAnalyzeMessageEnd = (messageList: ChatMessage[]) => {
  messageList.forEach((message) => {
    if (isPendingRequestMessage(message)) {
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
      message.items.some((messageItem) => isPendingRequestMessage(messageItem))
    ) {
      let updateMessageItem = message.items.map((messageItem) => {
        if (isPendingRequestMessage(messageItem)) {
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

export const groupReceivedMessagesForUI = (
  oldMessage: (IGroupMessage | ChatMessage)[],
  message: ChatMessage,
) => {
  const newMessageList = [...oldMessage]
  const index = newMessageList.findIndex((m) => {
    return m.threadID === message.threadID
  })
  if (index === -1) {
    if (isRequestMessage(message)) {
      newMessageList.push({
        threadID: message.threadID,
        items: [
          {
            sender: message.sender,
            message: message.message,
            threadID: message.threadID,
            messageType: message.messageType,
            status: MESSAGE_STATUS.ANALYZE_PENDING,
          },
        ],
      })
    } else {
      newMessageList.push({
        sender: message.sender,
        message: message.message,
        threadID: message.threadID,
        messageType: message.messageType,
      })
    }
  } else {
    const curMessage = newMessageList[index]
    if (isNormalMessage(curMessage)) {
      curMessage.message = curMessage.message + message.message
    } else {
      handleUpdateMessageList(curMessage, message)
    }
  }
  return newMessageList
}

export const groupReceivedMessagesForCache = async (
  mode: "edit" | "run",
  cacheInfo: {
    teamID: string
    cacheID: string
  },
  message: ChatWsAppendResponse,
) => {
  console.log("message", message)
  const setChatMessageCache =
    mode === "run" ? setRunCacheChatMessage : setEditCacheChatMessage
  const getChatMessageCache =
    mode === "run" ? getRunCacheChatMessage : getEditCacheChatMessage
  const oldMessage = await getChatMessageCache(
    cacheInfo.teamID,
    cacheInfo.cacheID,
  )

  const newMessageList = [...oldMessage] as ChatWsAppendResponse[]
  switch (message.messageType) {
    case MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_CHAT: {
      const prevChatMessage = newMessageList.find(
        (m) =>
          m.threadID === message.threadID &&
          m.messageType === message.messageType,
      )
      if (prevChatMessage) {
        prevChatMessage.message = prevChatMessage.message + message.message
      } else {
        newMessageList.push(message)
      }
      break
    }
    case MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_REQUEST: {
      const prevChatMessage = newMessageList.find(
        (m) =>
          m.threadID === message.threadID &&
          m.messageType === message.messageType,
      )
      if (prevChatMessage) {
        prevChatMessage.message = prevChatMessage.message + message.message
      } else {
        newMessageList.push(message)
      }
      break
    }
    case MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_OK:
    case MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_RETURN_ERROR:
  }
  setChatMessageCache(cacheInfo.teamID, cacheInfo.cacheID, newMessageList)
  return newMessageList
}
