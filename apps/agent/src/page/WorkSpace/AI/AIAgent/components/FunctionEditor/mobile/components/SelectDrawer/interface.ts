import { IEditorAIToolsVO } from "@illa-public/public-types"

export interface ISelectDrawerProps {
  selectModalVisible: boolean
  onCancel: () => void
  fieldAiTools: IEditorAIToolsVO[]
  handleValueChange: (values: IEditorAIToolsVO[]) => void
}
