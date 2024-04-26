import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useVariableToCompletionOption } from "../../../../../../../util"
import HeaderField from "../HeaderField"
import {
  descriptionContainerStyle,
  descriptionTextStyle,
  listItemContainerStyle,
} from "./style"

const DescriptionColumn: FC = () => {
  const { t } = useTranslation()

  const options = useVariableToCompletionOption()

  return (
    <div css={descriptionContainerStyle}>
      <HeaderField
        title={t("function.edit.variable_modal.label.description")}
      />
      {options.map((item, i) => (
        <div key={i} css={listItemContainerStyle}>
          <p css={descriptionTextStyle}>{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export default DescriptionColumn
