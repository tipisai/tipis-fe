import { IEditorFunction } from "@illa-public/public-types"

export interface IEditorFunctionItemProps extends IEditorFunction {
  isMobile?: boolean
  handleRemoveItem: (functionID: string) => void
}
