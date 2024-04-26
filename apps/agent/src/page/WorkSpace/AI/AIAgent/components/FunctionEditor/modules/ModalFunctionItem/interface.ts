import { IEditorAIToolsVO } from "@illa-public/public-types"

export interface IModalFunctionItemProps extends IEditorAIToolsVO {
  handleSelected: (checked: boolean, aiToolID: string) => void
  checked: boolean
}
