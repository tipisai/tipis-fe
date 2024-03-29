import { FC } from "react"
import { Outlet, useMatch } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import SettingMobileLayout from "./layout/mobile"
import SettingLayout from "./layout/pc"

export const Setting: FC = () => {
  const matchMobileSettingNav = useMatch("/setting")
  const matchMobileBilling = useMatch("/setting/:teamIdentifier/billing")

  return (
    <LayoutAutoChange
      desktopPage={
        <SettingLayout>
          <Outlet />
        </SettingLayout>
      }
      mobilePage={
        <SettingMobileLayout
          withoutPadding={!!matchMobileSettingNav || !!matchMobileBilling}
        >
          <Outlet />
        </SettingMobileLayout>
      }
    />
  )
}

export default Setting
