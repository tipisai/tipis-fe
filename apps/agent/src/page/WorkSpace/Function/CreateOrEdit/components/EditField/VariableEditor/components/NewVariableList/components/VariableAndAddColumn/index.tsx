import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { PlusIcon } from "@illa-public/icon"
import { useVariableToCompletionOption } from "@/page/WorkSpace/Function/CreateOrEdit/util"
import HeaderField from "../HeaderField"
import {
  addColumnContainerStyle,
  listItemContainerStyle,
  placeholderStyle,
  variableNameAndAddColumnStyle,
  variableNameContainerStyle,
  variableNameStyle,
} from "./style"

const VariableAndAddColumn: FC = () => {
  const { t } = useTranslation()

  const options = useVariableToCompletionOption()

  return (
    <div css={variableNameAndAddColumnStyle}>
      <div css={addColumnContainerStyle}>
        <div css={placeholderStyle} />
        {options.map((des, i) => (
          <div key={i} css={listItemContainerStyle(0)}>
            <Button icon={<Icon component={PlusIcon} />} type="text" />
          </div>
        ))}
      </div>
      <div css={variableNameContainerStyle}>
        <HeaderField
          title={t("function.edit.variable_modal.label.variable_name")}
        />
        {options.map((item, i) => (
          <div key={i} css={listItemContainerStyle(item.depth)}>
            <p css={variableNameStyle}>{item.key}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VariableAndAddColumn
