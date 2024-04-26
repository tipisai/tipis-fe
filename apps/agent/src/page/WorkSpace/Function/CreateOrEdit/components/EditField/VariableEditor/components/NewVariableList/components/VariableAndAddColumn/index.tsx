import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import HeaderField from "../HeaderField"
import { IDescriptionColumnProps } from "./interface"
import {
  descriptionContainerStyle,
  descriptionTextStyle,
  listItemContainerStyle,
  placeholderStyle,
  variableNameAndAddColumnStyle,
} from "./style"

const VariableAndAddColumn: FC<IDescriptionColumnProps> = (props) => {
  const { descriptions = [] } = props
  const { t } = useTranslation()
  return (
    <div css={variableNameAndAddColumnStyle}>
      <div css={descriptionContainerStyle}>
        <div css={placeholderStyle} />
        {descriptions.map((des, i) => (
          <div key={i} css={listItemContainerStyle}>
            <Button icon={<Icon component={PlusIcon} />} />
          </div>
        ))}
      </div>
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
    </div>
  )
}

export default VariableAndAddColumn
