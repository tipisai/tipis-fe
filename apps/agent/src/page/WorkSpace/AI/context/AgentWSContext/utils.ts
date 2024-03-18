import { isPremiumModel } from "@illa-public/market-agent"
import { IKnowledgeFile } from "@illa-public/public-types"
import {
  ChatMessage,
  ChatSendRequestPayload,
} from "@/components/PreviewChat/interface"

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
