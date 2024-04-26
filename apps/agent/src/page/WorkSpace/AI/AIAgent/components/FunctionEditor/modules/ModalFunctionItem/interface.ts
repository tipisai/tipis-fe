import { IEditorFunctionItem } from "@illa-public/public-types"

export interface IModalFunctionItemProps {
  functionDescription: string
  functionName: string
  functionIcon: string
  functionID: string
  handleSelected: (checked: boolean, functionItem: IEditorFunctionItem) => void
  checked: boolean
}
