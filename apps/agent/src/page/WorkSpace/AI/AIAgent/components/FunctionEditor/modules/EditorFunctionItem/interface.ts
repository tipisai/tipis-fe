import { IEditorAIToolsVO } from "@illa-public/public-types"

export interface IEditorAIToolsVOItemProps extends IEditorAIToolsVO {
  isMobile?: boolean
  handleRemoveItem: (functionID: string) => void
}
