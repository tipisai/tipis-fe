import { IKnowledgeFile } from "@illa-public/public-types"
import { FILE_ITEM_DETAIL_STATUS_IN_UI } from "@/utils/drive"

export interface IKnowledgeUploadProps {
  addFile: (file: IKnowledgeFile, isUpdate?: boolean) => void
  removeFile: (name: string) => void
  values: IKnowledgeFile[]
}

export interface IStatusIconProps {
  status: FILE_ITEM_DETAIL_STATUS_IN_UI
  onClickRetry?: () => void
}
