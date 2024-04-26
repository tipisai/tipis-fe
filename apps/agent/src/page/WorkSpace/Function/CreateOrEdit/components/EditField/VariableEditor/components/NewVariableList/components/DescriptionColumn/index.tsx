import { FC } from "react"
import { useTranslation } from "react-i18next"
import HeaderField from "../HeaderField"
import { IDescriptionColumnProps } from "./interface"
import {
  descriptionContainerStyle,
  descriptionTextStyle,
  listItemContainerStyle,
} from "./style"

const DescriptionColumn: FC<IDescriptionColumnProps> = (props) => {
  const { descriptions = [] } = props
  const { t } = useTranslation()
  return (
    <div css={descriptionContainerStyle}>
      <HeaderField
        title={t("function.edit.variable_modal.label.description")}
      />
      {descriptions.map((des, i) => (
        <div key={i} css={listItemContainerStyle}>
          <p css={descriptionTextStyle}>{des}</p>
        </div>
      ))}
    </div>
  )
}

export default DescriptionColumn
