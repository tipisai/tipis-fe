import { FC } from "react"
import { useTranslation } from "react-i18next"
import HeaderField from "../HeaderField"
import { ITypeColumnProps } from "./interface"
import {
  listItemContainerStyle,
  typeContainerStyle,
  typeTextStyle,
} from "./style"

const TypeColumn: FC<ITypeColumnProps> = (props) => {
  const { types = [] } = props
  const { t } = useTranslation()
  return (
    <div css={typeContainerStyle}>
      <HeaderField title={t("function.edit.variable_modal.label.type")} />
      {types.map((vType, i) => (
        <div key={i} css={listItemContainerStyle}>
          <p css={typeTextStyle}>{vType}</p>
        </div>
      ))}
    </div>
  )
}

export default TypeColumn
