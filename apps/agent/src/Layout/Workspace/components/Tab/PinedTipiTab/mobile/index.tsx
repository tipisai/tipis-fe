import { Avatar, Dropdown, MenuProps } from "antd"
import { FC, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { v4 } from "uuid"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { useRemovePinedTipiTabByTipiIDReducer } from "@/utils/pinedTabs/baseHook"
import { useNavigateToRunTipis } from "@/utils/routeHelper/hook"
import {
  baseMenuItemContainerStyle,
  baseOuterContainerStyle,
  basePCMenuItemButtonCustomIconContainerStyle,
} from "../../baseTabStyle"
import { menuItemNameStyle, menuItemStyle } from "../style"
import { IMobilePinedTipisTab } from "./interface"

const MobilePinedTipiTab: FC<IMobilePinedTipisTab> = (props) => {
  const { tipiID } = props
  const pinedTipiTabInfo = useSelector((state) =>
    getPinedTipisByTipisID(state, tipiID),
  )!
  const { t } = useTranslation()

  const navigateToRunTipis = useNavigateToRunTipis()
  const removePinedTipi = useRemovePinedTipiTabByTipiIDReducer()

  const pressTimer = useRef<number>()
  const isLongPressTriggered = useRef(false)
  const [openDropDown, setOpenDropDown] = useState(false)

  const menuItems: MenuProps["items"] = [
    {
      key: "run",
      label: t("homepage.tipi_dashboard.tab.run"),
    },
    {
      key: "unpin",
      label: t("dashboard.common.unpin"),
      danger: true,
    },
  ]

  const { tabIcon, tabName, tipiOwnerTeamIdentity } = pinedTipiTabInfo

  const onTouchStart = () => {
    isLongPressTriggered.current = false
    const timer = window.setTimeout(() => {
      setOpenDropDown(true)
      isLongPressTriggered.current = true
    }, 300)

    pressTimer.current = timer
  }

  const onTouchEnd = () => {
    clearTimeout(pressTimer.current)
    if (!isLongPressTriggered.current) {
      handleNavigateToRunTipis()
    }
  }

  const handleNavigateToRunTipis = () => {
    navigateToRunTipis(
      {
        tipisID: tipiID,
        tipisIcon: tabIcon,
        tipisName: tabName,
      },
      v4(),
      tipiOwnerTeamIdentity,
    )
  }

  const handleMenuCLick: MenuProps["onClick"] = async ({ key, domEvent }) => {
    domEvent.stopPropagation()
    switch (key) {
      case "run": {
        handleNavigateToRunTipis()
        break
      }
      case "unpin": {
        await removePinedTipi(tipiID)
      }
    }
  }

  useEffect(() => {
    return () => clearTimeout(pressTimer.current)
  }, [])

  return (
    <Dropdown
      open={openDropDown}
      menu={{
        items: menuItems,
        onClick: handleMenuCLick,
      }}
      onOpenChange={setOpenDropDown}
    >
      <div
        css={baseOuterContainerStyle(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div css={menuItemStyle}>
          <div
            css={baseMenuItemContainerStyle(false)}
            className="menu-item-inner-container"
          >
            <span css={basePCMenuItemButtonCustomIconContainerStyle}>
              <Avatar src={tabIcon} shape="circle" size={24} />
            </span>
            <span css={menuItemNameStyle}>{tabName}</span>
          </div>
        </div>
      </div>
    </Dropdown>
  )
}

export default MobilePinedTipiTab
