import { TextSignal } from "@/api/ws/textSignal"
import { SEND_MESSAGE_WS_TYPE } from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
  IGroupMessage,
  MESSAGE_STATUS,
  MESSAGE_SYNC_TYPE,
} from "@/components/PreviewChat/interface"
import { AgentInitial } from "@/page/WorkSpace/AI/AIAgent/interface"
import { isGroupMessage, isNormalMessage } from "./typeHelper"

export const formatSendMessagePayload = (payload: ChatSendRequestPayload) => {
  const encodePayload: ChatSendRequestPayload = payload

  Object.keys(encodePayload).forEach((key) => {
    if (key === "prompt") {
      encodePayload[key] = encodeURIComponent(encodePayload[key])
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
    if (isErrorMessageRes(message) || isSuccessMessageRes(message)) {
      curMessage.items.push({
        ...message,
        message: "",
      })
    } else {
      curMessage.items.push({
        ...message,
        status: isRequestMessage(message)
          ? MESSAGE_STATUS.ANALYZE_PENDING
          : undefined,
      })
    }
  }
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

export const getSendMessageBody = (message: ChatMessage, aiAgentID: string) => {
  const { agentType, model, modelConfig, variables } = AgentInitial

  return {
    payload: {
      threadID: message.threadID,
      prompt: message.message,
      variables,
      actionID: aiAgentID,
      modelConfig,
      model,
      agentType,
    },
    signal: TextSignal.RUN,
    type: SEND_MESSAGE_WS_TYPE.CHAT,
    fileIDs: message?.knowledgeFiles?.map((item) => item.fileID) || [],
    updateMessage: true,
    messageContent: message,
  }
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
