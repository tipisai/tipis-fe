import Icon from "@ant-design/icons"
import { Button, Divider } from "antd"
import { FC, useContext } from "react"
import { NextDoubleIcon } from "@illa-public/icon"
import LogoIcon from "@/assets/public/logo.svg?react"
import UserInfoContent from "../../../components/UserInfoContent"
import RecentTabs from "../../RecentTabs"
import { MenuStatusUIContext } from "../context"
import {
  dividerContainerStyle,
  miniMenuContainerStyle,
  miniMenuFooterContainerStyle,
  miniMenuInnerContainerStyle,
  miniMenuLockSideBarContainerStyle,
  miniMenuTopAreaContainerStyle,
  miniMenuUserAvatarContainerStyle,
  userInfoContainerStyle,
} from "./style"

const MiniMenu: FC = () => {
  const { changeCollapsed } = useContext(MenuStatusUIContext)

  return (
    <section css={miniMenuContainerStyle}>
      <div css={miniMenuInnerContainerStyle}>
        <div css={miniMenuTopAreaContainerStyle}>
          <div css={miniMenuUserAvatarContainerStyle}>
            <Icon component={LogoIcon} />
          </div>
          <div css={miniMenuLockSideBarContainerStyle}>
            <Button
              icon={<Icon component={NextDoubleIcon} />}
              type="text"
              onClick={() => {
                changeCollapsed(false)
              }}
            />
          </div>
          <div css={dividerContainerStyle}>
            <Divider
              style={{
                margin: "0",
              }}
            />
          </div>
          <RecentTabs isMiniSize />
        </div>
        <div css={miniMenuFooterContainerStyle}>
          <div css={dividerContainerStyle}>
            <Divider
              style={{
                margin: "0",
              }}
            />
          </div>
          <div css={userInfoContainerStyle}>
            <UserInfoContent isMiniSize />
          </div>
        </div>
      </div>
    </section>
  )
}

MiniMenu.displayName = "MiniMenu"

export default MiniMenu
