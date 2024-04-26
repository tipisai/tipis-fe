import Icon from "@ant-design/icons"
import { Button } from "antd"
import { FC } from "react"
import { DeleteIcon, PenIcon } from "@illa-public/icon"
import { IActionColumnProps } from "./interface"
import {
  actionContainerStyle,
  listItemContainerStyle,
  placeholderStyle,
} from "./style"

const ActionColumn: FC<IActionColumnProps> = (props) => {
  const { descriptions = [] } = props
  return (
    <div css={actionContainerStyle}>
      <div css={placeholderStyle} />
      {descriptions.map((des, i) => (
        <div key={i} css={listItemContainerStyle}>
          <Button icon={<Icon component={PenIcon} />} type="text" />
          <Button icon={<Icon component={DeleteIcon} />} type="text" />
        </div>
      ))}
    </div>
  )
}

export default ActionColumn
