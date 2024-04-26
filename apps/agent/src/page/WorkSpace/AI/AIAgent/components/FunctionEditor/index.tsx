import { FC } from "react"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import FunctionsEditorMobile from "./mobile"
import FunctionsEditorPC from "./pc"

const FunctionsEditor: FC = () => {
  return (
    <LayoutAutoChange
      desktopPage={<FunctionsEditorPC />}
      mobilePage={<FunctionsEditorMobile />}
    />
  )
}

export default FunctionsEditor
