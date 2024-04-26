import { IEditorFunction } from "@illa-public/public-types"

export interface ISelectModalContentPCProps {
  onCancel: () => void
  onConfirm: (value: IEditorFunction[]) => void
  handleClickCreate: () => void
  functions: IEditorFunction[]
  fieldFunctions: IEditorFunction[]
}
