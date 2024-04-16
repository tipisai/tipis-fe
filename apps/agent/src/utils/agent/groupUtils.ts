import {
  ChatMessage,
  IFileMessage,
  MESSAGE_STATUS,
  MESSAGE_SYNC_TYPE,
  NEED_GROUP_MESSAGE_TYPE,
} from "@/components/PreviewChat/interface"

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

export const isFileMessage = (message: ChatMessage) => {
  return (
    message.messageType === MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_TOOL_FILE
  )
}

export const isShowDetailFileMessage = (message: ChatMessage): boolean => {
  if (!isFileMessage(message)) {
    return false
  }
  const content = JSON.parse(JSON.stringify(message.message))
  return content?.contentType?.startsWith("image/")
}

export const isNeedStartGroupMessage = (message: ChatMessage) => {
  return NEED_GROUP_MESSAGE_TYPE.includes(message.messageType)
}

export const handleFileMessage = (message: ChatMessage): ChatMessage | null => {
  if (!isShowDetailFileMessage(message)) return message
  let fileInfos: IFileMessage[] = []
  try {
    fileInfos = JSON.parse(message.message)
  } catch (e) {}
  if (!Array.isArray(fileInfos) || fileInfos.length === 0) {
    return null
  }
  const curMessage = {
    ...message,
    messageType: MESSAGE_SYNC_TYPE.GPT_CHAT_MESSAGE_TYPE_CHAT,
  }
  let messageContent = "\n\n"
  for (let imageFileInfo of fileInfos) {
    const { downloadURL, contentType, fileName } = imageFileInfo
    const fileURL = new URLSearchParams(downloadURL)
    fileURL.set("contentType", contentType)
    fileURL.set("fileName", fileName)
    messageContent += `![${fileName}(${fileURL.toString()})]\n\n`
  }
  curMessage.message = messageContent
  return curMessage
}
