import { FC } from "react"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import Entrance from "./component/Entrance"

const MobileSettingNavPage: FC = () => {
  return (
    <LayoutAutoChange
      desktopPage={<Navigate to="account" replace />}
      mobilePage={<Entrance />}
    />
  )
}

export default MobileSettingNavPage
