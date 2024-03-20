import Icon from "@ant-design/icons"
import { Avatar, Button, Divider, Popover } from "antd"
import { FC, useContext } from "react"
import { useSelector } from "react-redux"
import { NextDoubleIcon } from "@illa-public/icon"
import { getCurrentUser } from "@illa-public/user-data"
import DiscordIcon from "@/assets/public/discord.svg?react"
import DocumentIcon from "@/assets/public/document.svg?react"
import SettingIcon from "@/assets/public/setting.svg?react"
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
  popoverContentContainerStyle,
} from "./style"

const MiniMenu: FC = () => {
  const userInfo = useSelector(getCurrentUser)
  const { changeCollapsed } = useContext(MenuStatusUIContext)

  return (
    <section css={miniMenuContainerStyle}>
      <div css={miniMenuInnerContainerStyle}>
        <div css={miniMenuTopAreaContainerStyle}>
          <div css={miniMenuUserAvatarContainerStyle}>
            <Avatar src={userInfo.avatar} shape="circle" size={24} />
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
          <Popover
            arrow={false}
            autoAdjustOverflow
            placement="right"
            trigger={["click"]}
            align={{
              offset: [8, -16],
            }}
            content={
              <div css={popoverContentContainerStyle}>
                <Button
                  type="text"
                  block
                  icon={<Icon component={DiscordIcon} />}
                >
                  Click me!
                </Button>
                <Button
                  type="text"
                  block
                  icon={<Icon component={DocumentIcon} />}
                >
                  Click me!
                </Button>
                <Button
                  type="text"
                  block
                  icon={<Icon component={SettingIcon} />}
                >
                  Click me!
                </Button>
              </div>
            }
          >
            <div css={miniMenuUserAvatarContainerStyle}>
              <Avatar
                src={userInfo.avatar}
                shape="circle"
                size={32}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
          </Popover>
        </div>
      </div>
    </section>
  )
}

MiniMenu.displayName = "MiniMenu"

export default MiniMenu
