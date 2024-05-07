import { IEditorAIToolsVO } from "@illa-public/public-types"

export interface ISelectModalContentMobileProps {
  onCancel: () => void
  onConfirm: (value: IEditorAIToolsVO[]) => void
  functions: IEditorAIToolsVO[]
  fieldFunctions: IEditorAIToolsVO[]
}
