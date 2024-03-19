import Icon from "@ant-design/icons"
import {
  GridRenderCellParams,
  gridFilteredDescendantCountLookupSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid-premium"
import { Button, ButtonProps } from "antd"
import { FC } from "react"
import { DownIcon, NextIcon } from "@illa-public/icon"
import { expandButtonContainerStyle } from "./style"

const CustomGroupingCell: FC<GridRenderCellParams> = (props) => {
  const { id, field, rowNode } = props
  const apiRef = useGridApiContext()
  const filteredDescendantCountLookup = useGridSelector(
    apiRef,
    gridFilteredDescendantCountLookupSelector,
  )

  const filteredDescendantCount = filteredDescendantCountLookup[rowNode.id] ?? 0

  const handleClick: ButtonProps["onClick"] = (event) => {
    if (rowNode.type !== "group") {
      return
    }
    apiRef.current.setRowChildrenExpansion(id, !rowNode.childrenExpanded)
    apiRef.current.setCellFocus(id, field)
    event.stopPropagation()
  }
  return filteredDescendantCount > 0 && rowNode.type === "group" ? (
    <div css={expandButtonContainerStyle(rowNode.depth * 16)}>
      <Button
        onClick={handleClick}
        type="text"
        icon={
          <Icon component={rowNode.childrenExpanded ? NextIcon : DownIcon} />
        }
      />
    </div>
  ) : null
}

export default CustomGroupingCell
