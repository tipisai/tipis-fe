import { ModalFuncProps } from "antd"

export interface IModalInstance {
  update: (config: ModalFuncProps) => void
  destroy: () => void
}
