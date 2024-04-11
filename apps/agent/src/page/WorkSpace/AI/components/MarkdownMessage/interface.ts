export enum CODE_STATUS {
  DEFAULT = "default",
  SUCCESS = "success",
  ERROR = "error",
}

export interface MarkdownMessageProps {
  isReceiving: boolean
  disableTrigger?: boolean
  isOwnMessage?: boolean
  children?: string
  codeStatus?: CODE_STATUS
}
