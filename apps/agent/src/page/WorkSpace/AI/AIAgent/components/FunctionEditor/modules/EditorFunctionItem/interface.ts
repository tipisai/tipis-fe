import { IEditorFunctionItem } from "@illa-public/public-types"

export interface IEditorFunctionItemProps extends IEditorFunctionItem {
  isDeleted?: boolean
  handleRemoveItem: (functionID: string) => void
}
