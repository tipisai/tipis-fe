import { ButtonProps } from "antd"

export interface ICreateVariableButtonProps {
  addedIndex: number
  buttonProps: {
    type?: ButtonProps["type"]
    size?: ButtonProps["size"]
    block?: ButtonProps["block"]
    hiddenButton?: boolean
  }
}
