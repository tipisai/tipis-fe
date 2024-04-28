import { IEditorAIToolsVO } from "@illa-public/public-types"

export interface ISelectModalProps {
  selectModalVisible: boolean
  onCancel: () => void
  fieldAiTools: IEditorAIToolsVO[]
  handleClickCreate: () => void
  handleValueChange: (values: IEditorAIToolsVO[]) => void
}
