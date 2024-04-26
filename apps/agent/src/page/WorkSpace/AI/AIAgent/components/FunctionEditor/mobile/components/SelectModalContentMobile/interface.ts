import { IEditorFunction } from "@illa-public/public-types"

export interface ISelectModalContentMobileProps {
  onCancel: () => void
  onConfirm: (value: IEditorFunction[]) => void
  functions: IEditorFunction[]
  fieldFunctions: IEditorFunction[]
}
