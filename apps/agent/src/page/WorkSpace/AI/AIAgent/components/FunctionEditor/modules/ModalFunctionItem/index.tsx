import { Checkbox, Image } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { FC } from "react"
import { IModalFunctionItemProps } from "./interface"
import {
  functionDescStyle,
  functionInfoStyle,
  functionItemContainerStyle,
  functionNameStyle,
} from "./style"

const ModalFunctionItem: FC<IModalFunctionItemProps> = ({
  functionDescription,
  functionID,
  functionName,
  functionIcon,
  handleSelected,
  checked,
}) => {
  const onSelectChange = (e: CheckboxChangeEvent) => {
    const v = e.target.checked
    handleSelected(v, {
      functionID,
      functionName,
      functionIcon,
    })
  }
  return (
    <label css={functionItemContainerStyle}>
      <Image
        width={32}
        height={32}
        preview={false}
        src={functionIcon}
        style={{ borderRadius: 8 }}
      />
      <span css={functionInfoStyle}>
        <span css={functionNameStyle}>{functionName}</span>
        <span css={functionDescStyle}>{functionDescription}</span>
      </span>
      <Checkbox checked={checked} onChange={onSelectChange} />
    </label>
  )
}
export default ModalFunctionItem
