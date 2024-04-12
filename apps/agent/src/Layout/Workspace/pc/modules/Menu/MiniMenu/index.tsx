import Icon from "@ant-design/icons"
import { Button, ConfigProvider, Divider, Tooltip } from "antd"
import { FC, useCallback, useContext } from "react"
import { useTranslation } from "react-i18next"
import { TipisTrack } from "@illa-public/track-utils"
import UserInfoContent from "@/Layout/Workspace/components/UserInfoContent"
import PCRecentTabs from "@/Layout/Workspace/modules/RecentTabs/pc"
import LogoIcon from "@/assets/public/logo.svg?react"
import MenuExpandIcon from "@/assets/workspace/menuExpand.svg?react"
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

  const { t } = useTranslation()

  const onClickFoldButton = useCallback(() => {
    TipisTrack.track("click_collapse")

    changeCollapsed(false)
  }, [changeCollapsed])

  return (
    <section css={miniMenuContainerStyle}>
      <div css={miniMenuInnerContainerStyle}>
        <div css={miniMenuTopAreaContainerStyle}>
          <div css={miniMenuUserAvatarContainerStyle}>
            <Icon component={LogoIcon} />
          </div>
          <div css={miniMenuLockSideBarContainerStyle}>
            <Tooltip
              title={t("homepage.left_panel.tab.expand_menu")}
              placement="right"
              align={{
                offset: [16, 0],
              }}
            >
              <Button
                icon={<Icon component={MenuExpandIcon} />}
                type="text"
                onClick={onClickFoldButton}
              />
            </Tooltip>
          </div>
          <div css={dividerContainerStyle}>
            <ConfigProvider
              theme={{
                components: {
                  Divider: {
                    textPaddingInline: 0,
                    colorSplit: "rgba(16, 9, 116, 0.08);",
                  },
                },
              }}
            >
              <Divider
                style={{
                  margin: "0",
                }}
              />
            </ConfigProvider>
          </div>
          <PCRecentTabs isMiniSize />
        </div>
        <div css={miniMenuFooterContainerStyle}>
          <div css={dividerContainerStyle}>
            <ConfigProvider
              theme={{
                components: {
                  Divider: {
                    textPaddingInline: 0,
                    colorSplit: "rgba(16, 9, 116, 0.08);",
                  },
                },
              }}
            >
              <Divider
                style={{
                  margin: "0",
                }}
              />
            </ConfigProvider>
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
