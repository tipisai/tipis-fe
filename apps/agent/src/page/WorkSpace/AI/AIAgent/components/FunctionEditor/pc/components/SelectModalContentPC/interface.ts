import { IEditorAIToolsVO } from "@illa-public/public-types"

export interface ISelectModalContentPCProps {
  onCancel: () => void
  onConfirm: (value: IEditorAIToolsVO[]) => void
  handleClickCreate: () => void
  functions: IEditorAIToolsVO[]
  fieldFunctions: IEditorAIToolsVO[]
}
