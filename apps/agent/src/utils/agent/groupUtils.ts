import {
  ChatMessage,
  MESSAGE_STATUS,
  MESSAGE_SYNC_TYPE,
} from "@/components/_PreviewChatCache/interface"

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

export const isLinkedPendingMessage = (
  targetMessage: ChatMessage,
  message: ChatMessage,
): boolean => {
  if (
    !isPendingRequestMessage(targetMessage) ||
    (!isErrorMessageRes(message) && !isSuccessMessageRes(message))
  )
    return false
  let targetCallId, callId
  try {
    targetCallId = JSON.parse(targetMessage.message)?.["tool_call_id"]
    callId = JSON.parse(message.message)?.["tool_call_id"]
    return !!targetCallId && targetCallId === callId
  } catch (e) {
    return false
  }
}
