import { ReactNode } from "react"
import { UploadFileStore } from "@/utils/drive"

export interface IUploadContextInjectProps {
  uploadFileStore: UploadFileStore
}

export interface IUploadContextProviderProps {
  children: ReactNode
}
