import {
  IAIMessageDTO,
  IFunctionMessageDTO,
  IMessageCycleVO,
  IToolUseMessageContent,
  MESSAGE_ROLE_TYPE,
  MESSAGE_STATUS,
} from "../interface"

export const cancelPendingMessage = () => {}

export const isToolUseMessageContent = (
  content: string | IToolUseMessageContent,
): content is IToolUseMessageContent => {
  return typeof content === "object" && "code" in content
}

export const handleReceiveMessage = (
  message: IAIMessageDTO | IFunctionMessageDTO,
  cacheMessage: IMessageCycleVO,
) => {
  if (message.type === MESSAGE_ROLE_TYPE.FUNCTION) {
    const { aiMessage } = JSON.parse(JSON.stringify(cacheMessage) || "{}")
    const toolMessage = aiMessage[aiMessage.length - 1]
    if (!toolMessage) {
      return null
    }
    if (!message.error) {
      toolMessage.status = MESSAGE_STATUS.ANALYZE_SUCCESS
    } else {
      toolMessage.status = MESSAGE_STATUS.ANALYZE_FAILED
      toolMessage.message_result = message.content.content
    }
    return {
      ...cacheMessage,
      aiMessage: [...aiMessage],
    }
  } else if (isToolUseMessageContent(message.content)) {
    return {
      ...cacheMessage,
      aiMessage: [
        ...cacheMessage.aiMessage,
        {
          type: MESSAGE_ROLE_TYPE.AI,
          message_id: message.message_id,
          content: message.content.input.code,
          function_name: message.content.name,
          message_type: message.message_type,
          status: MESSAGE_STATUS.ANALYZE_PENDING,
        },
      ],
    }
  } else {
    return {
      ...cacheMessage,
      aiMessage: [
        ...cacheMessage.aiMessage,
        {
          type: MESSAGE_ROLE_TYPE.AI,
          message_id: message.message_id,
          content: message.content,
          message_type: message.message_type,
        },
      ],
    }
  }
}
