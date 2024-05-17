import {
  IToolUseMessageContent,
  MESSAGE_STATUS,
} from "@/components/ChatDashBoard/interface"

export interface IToolMessageProps {
  content: IToolUseMessageContent
  functionName: string
  status: MESSAGE_STATUS
  message_result?: string
}
