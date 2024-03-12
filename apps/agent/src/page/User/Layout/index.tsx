import { Outlet } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import UserLayoutPC from "./desktopLayout"
import UserLayoutMobile from "./mobileLayout"

const UserLayOut = () => {
  return (
    <LayoutAutoChange
      desktopPage={
        <UserLayoutPC>
          <Outlet />
        </UserLayoutPC>
      }
      mobilePage={
        <UserLayoutMobile>
          <Outlet />
        </UserLayoutMobile>
      }
    />
  )
}

export default UserLayOut
