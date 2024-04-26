import { IEditorFunction } from "@illa-public/public-types"

export interface IModalFunctionItemProps extends IEditorFunction {
  handleSelected: (checked: boolean, aiToolID: string) => void
  checked: boolean
}
