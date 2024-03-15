import Icon from "@ant-design/icons"
import { GridToolbarContainer } from "@mui/x-data-grid-premium"
import { Button } from "antd"
import { PlusIcon } from "@illa-public/icon"
import { IEditToolbarProps } from "./interface"

function EditToolbar(props: IEditToolbarProps) {
  const { addRows } = props

  const handleClick = () => {
    addRows([])
  }

  return (
    <GridToolbarContainer>
      <Button
        type="text"
        icon={<Icon component={PlusIcon} />}
        onClick={handleClick}
      >
        Add record
      </Button>
    </GridToolbarContainer>
  )
}

export default EditToolbar
