import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useVariableToCompletionOption } from "@/page/WorkSpace/Function/CreateOrEdit/util"
import HeaderField from "../HeaderField"
import {
  listItemContainerStyle,
  typeContainerStyle,
  typeTextStyle,
} from "./style"

const TypeColumn: FC = () => {
  const { t } = useTranslation()
  const options = useVariableToCompletionOption()

  return (
    <div css={typeContainerStyle}>
      <HeaderField title={t("function.edit.variable_modal.label.type")} />
      {options.map((item, i) => (
        <div key={i} css={listItemContainerStyle}>
          <p css={typeTextStyle}>{item.originType}</p>
        </div>
      ))}
    </div>
  )
}

export default TypeColumn
