export const ACCEPT_CONTENT_TYPES = [
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.sealed.csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/pdf",
  "application/json",
  "text/plain",
  "text/markdown",
  "text/csv",
]

export enum SEND_CONTENT_TYPES {
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  PDF = "application/pdf",
  JSON = "application/json",
  TEXT = "text/plain",
  MD = "text/markdown",
  CSV = "text/csv",
}

export const ACCEPT = [
  ".docx",
  ".csv",
  ".xlsx",
  ".pdf",
  ".json",
  ".txt",
  ".md",
  ".csv",
  ".mdx",
]

export const MAX_MESSAGE_FILES_LENGTH = 10
export const MAX_FILE_SIZE = 20971520 // 20MB

export enum TYPE_MAPPING {
  ZIP = "0x50 0x4B 0x3 0x4",
  PDF = "0x25 0x50 0x44 0x46 0x2D 0x31 0x2E",
}
