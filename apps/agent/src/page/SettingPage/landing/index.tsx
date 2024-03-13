import { FC } from "react"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import SettingMobileLayout from "@/page/SettingPage/layout/mobile"
import MobileEntrance from "./mobileEntrance"

const SettingLanding: FC = () => {
  return (
    <LayoutAutoChange
      desktopPage={<Navigate to="account" replace />}
      mobilePage={
        <SettingMobileLayout withoutPadding>
          <MobileEntrance />
        </SettingMobileLayout>
      }
    />
  )
}

export default SettingLanding
