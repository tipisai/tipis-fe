import { IEditorFunctionItem } from "@illa-public/public-types"
import { IFunctionItemDetail } from "../../../interface"

export interface ISelectModalContentPCProps {
  onCancel: () => void
  onConfirm: (value: IEditorFunctionItem[]) => void
  handleClickCreate: () => void
  functions: IFunctionItemDetail[]
  fieldFunctions: IEditorFunctionItem[]
}
