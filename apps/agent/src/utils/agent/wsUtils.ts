import { klona } from "klona"
import { TextSignal } from "@/api/ws/textSignal"
import { SEND_MESSAGE_WS_TYPE } from "@/components/PreviewChat/TipisWebscoketContext/interface"
import {
  ChatMessage,
  ChatSendRequestPayload,
  IGroupMessage,
  MESSAGE_STATUS,
} from "@/components/PreviewChat/interface"
import { AgentInitial } from "@/page/WorkSpace/AI/AIAgent/interface"
import { DELAY_TASK_TIME } from "./constants"
import {
  isErrorMessageRes,
  isLinkedPendingMessage,
  isPendingRequestMessage,
  isRequestMessage,
  isSuccessMessageRes,
} from "./groupUtils"
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

export const handleUpdateMessageList = (
  curMessage: IGroupMessage,
  nextMessage: ChatMessage,
) => {
  const currentMessage = curMessage.items[curMessage.items.length - 1]
  if (currentMessage.messageType === nextMessage.messageType) {
    currentMessage.message = currentMessage.message + nextMessage.message
  } else {
    if (isLinkedPendingMessage(currentMessage, nextMessage)) {
      currentMessage.status = isErrorMessageRes(nextMessage)
        ? MESSAGE_STATUS.ANALYZE_FAILED
        : MESSAGE_STATUS.ANALYZE_SUCCESS

      currentMessage.messageResult = isErrorMessageRes(nextMessage)
        ? nextMessage.message
        : undefined
    }
    if (isSuccessMessageRes(nextMessage) || isErrorMessageRes(nextMessage)) {
      curMessage.items.push({
        ...nextMessage,
        message: "",
      })
    } else {
      curMessage.items.push({
        ...nextMessage,
        status: isRequestMessage(nextMessage)
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
      if (curMessage.messageType === message.messageType) {
        curMessage.message = curMessage.message + message.message
      } else {
        // compliant not use request type start
        newMessageList[index] = {
          threadID: curMessage.threadID,
          items: [
            {
              sender: curMessage.sender,
              message: curMessage.message,
              threadID: curMessage.threadID,
              messageType: curMessage.messageType,
              status: isRequestMessage(curMessage)
                ? MESSAGE_STATUS.ANALYZE_PENDING
                : undefined,
            },
          ],
        }
        handleUpdateMessageList(newMessageList[index] as IGroupMessage, message)
      }
    } else {
      handleUpdateMessageList(curMessage, message)
    }
  }
  return newMessageList
}

export const groupRenderReceivedMessageForUI = (
  oldMessage: IGroupMessage | ChatMessage | null,
  message: ChatMessage,
) => {
  if (!oldMessage || oldMessage.threadID !== message.threadID) {
    if (isRequestMessage(message)) {
      return {
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
      }
    } else {
      return {
        sender: message.sender,
        message: message.message,
        threadID: message.threadID,
        messageType: message.messageType,
      }
    }
  } else {
    let copyOldMessage = klona(oldMessage)
    if (isNormalMessage(copyOldMessage)) {
      if (copyOldMessage.messageType === message.messageType) {
        copyOldMessage.message = copyOldMessage.message + message.message
      } else {
        // compliant not use request type start
        copyOldMessage = {
          threadID: oldMessage.threadID,
          items: [
            {
              sender: copyOldMessage.sender,
              message: copyOldMessage.message,
              threadID: copyOldMessage.threadID,
              messageType: copyOldMessage.messageType,
              status: isRequestMessage(copyOldMessage)
                ? MESSAGE_STATUS.ANALYZE_PENDING
                : undefined,
            },
          ],
        }
        handleUpdateMessageList(copyOldMessage as IGroupMessage, message)
      }
    } else {
      handleUpdateMessageList(copyOldMessage, message)
    }
    return copyOldMessage
  }
}

export const getNeedCacheUIMessage = (
  messageList: (IGroupMessage | ChatMessage)[],
): (IGroupMessage | ChatMessage)[] => {
  const newMessageList = messageList.map((message) => {
    if (
      isGroupMessage(message) &&
      message.items.some((messageItem) => isPendingRequestMessage(messageItem))
    ) {
      let updateMessageItem = message.items.filter(
        (messageItem) => !isPendingRequestMessage(messageItem),
      )
      if (updateMessageItem.length === 0) {
        return null
      }
      return {
        ...message,
        items: updateMessageItem,
      }
    }
    return message
  })

  return newMessageList.filter((item) => !!item) as (
    | IGroupMessage
    | ChatMessage
  )[]
}

export const delayHandleTask = (task: () => void) => {
  return new Promise((resolve) => {
    task()
    setTimeout(() => {
      resolve(true)
    }, DELAY_TASK_TIME)
  })
}
