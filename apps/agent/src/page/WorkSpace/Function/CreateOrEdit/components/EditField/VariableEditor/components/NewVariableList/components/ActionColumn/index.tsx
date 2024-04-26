import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { DeleteOutlineIcon, PenIcon } from "@illa-public/icon"
import { useVariableToCompletionOption } from "../../../../../../../util"
import {
  actionContainerStyle,
  listItemContainerStyle,
  placeholderStyle,
} from "./style"

const ActionColumn: FC = () => {
  const options = useVariableToCompletionOption()

  return (
    <div css={actionContainerStyle}>
      <div css={placeholderStyle} />
      {options.map((_, i) => (
        <div key={i} css={listItemContainerStyle}>
          <Button icon={<Icon component={PenIcon} />} type="text" />
          <Button icon={<Icon component={DeleteOutlineIcon} />} type="text" />
        </div>
      ))}
    </div>
  )
}

export default ActionColumn
