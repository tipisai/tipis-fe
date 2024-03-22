import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import MobileEditPanel from "../../mobile/module/EditPanel"
import PCEditPanel from "../../pc/modules/EditPanel"

const EditPanel: FC = () => {
  return (
    <LayoutAutoChange
      desktopPage={<PCEditPanel />}
      mobilePage={<MobileEditPanel />}
    />
  )
}

export default EditPanel
