import { IEditorFunctionItem } from "@illa-public/public-types"
import { IFunctionItemDetail } from "../../../interface"

export interface ISelectModalContentMobileProps {
  onCancel: () => void
  onConfirm: (value: IEditorFunctionItem[]) => void
  functions: IFunctionItemDetail[]
  fieldFunctions: IEditorFunctionItem[]
}
