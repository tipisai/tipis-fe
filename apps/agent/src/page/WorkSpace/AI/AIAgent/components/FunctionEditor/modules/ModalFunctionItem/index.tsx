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
  aiToolID,
  name,
  description,
  config,
  handleSelected,
  checked,
}) => {
  const onSelectChange = (e: CheckboxChangeEvent) => {
    const v = e.target.checked
    handleSelected(v, aiToolID)
  }
  return (
    <label css={functionItemContainerStyle}>
      <Image
        width={32}
        height={32}
        preview={false}
        src={config.icon}
        style={{ borderRadius: 8 }}
      />
      <span css={functionInfoStyle}>
        <span css={functionNameStyle}>{name}</span>
        <span css={functionDescStyle}>{description}</span>
      </span>
      <Checkbox checked={checked} onChange={onSelectChange} />
    </label>
  )
}
export default ModalFunctionItem
