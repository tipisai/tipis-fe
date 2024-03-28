import { IKnowledgeFile } from "@illa-public/public-types"

export interface IKnowledgeUploadProps {
  addFile: (file: IKnowledgeFile, isUpdate?: boolean) => void
  removeFile: (name: string) => void
  values: IKnowledgeFile[]
}
