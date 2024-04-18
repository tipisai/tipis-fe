import Icon from "@ant-design/icons"
import { Avatar, Button, Dropdown, MenuProps, Tooltip } from "antd"
import { FC, MouseEventHandler, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { MoreIcon } from "@illa-public/icon"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { useGetCurrentTeamInfo } from "@/utils/team"
import DropIndicator from "../../DropIndicator/DropIndicator"
import {
  baseMenuItemContainerStyle,
  baseOuterContainerStyle,
  basePCMenuItemButtonCustomIconContainerStyle,
  draggingStyle,
} from "../../baseTabStyle"
import { DRAG_TAB_TYPES, useTabSortableItem } from "../../hook"
import { menuItemNameStyle, menuItemStyle } from "../style"
import { IPCPinedTipisTab } from "./interface"
import { moreActionButtonStyle } from "./style"

const PCPinedTipiTab: FC<IPCPinedTipisTab> = (props) => {
  const { tipiID, isMiniSize, index } = props
  const pinedTipiTabInfo = useSelector((state) =>
    getPinedTipisByTipisID(state, tipiID),
  )!
  const currentTeamInfo = useGetCurrentTeamInfo()
  const { t } = useTranslation()

  const { tabIcon, tabName, tipiOwnerTeamIdentity } = pinedTipiTabInfo
  const isCurrentUserTeam =
    currentTeamInfo?.identifier === tipiOwnerTeamIdentity

  const ref = useRef<HTMLDivElement>(null)

  const { closestEdge, draggableState } = useTabSortableItem(
    index,
    pinedTipiTabInfo ? { ...pinedTipiTabInfo } : undefined,
    DRAG_TAB_TYPES.PINED_TAB,
    ref,
  )

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

  const onClickRemoveTab: MouseEventHandler<HTMLElement> = async (e) => {
    e.stopPropagation()
  }

  const onClick = () => {
    if (isCurrentUserTeam) {
    }
  }

  const navLinkComp = (
    <div
      onClick={onClick}
      css={[
        baseOuterContainerStyle(isMiniSize),
        draggableState.type === "dragging" && draggingStyle,
      ]}
      ref={ref}
      data-can-drop-type={DRAG_TAB_TYPES.PINED_TAB}
    >
      <div css={menuItemStyle}>
        <div
          css={baseMenuItemContainerStyle(isMiniSize)}
          className="menu-item-inner-container"
        >
          <span css={basePCMenuItemButtonCustomIconContainerStyle}>
            <Avatar src={tabIcon} shape="circle" size={24} />
          </span>
          {!isMiniSize && <span css={menuItemNameStyle}>{tabName}</span>}
          {!isMiniSize && (
            <div css={moreActionButtonStyle} className="more-button">
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: menuItems,
                }}
              >
                <Button
                  size="small"
                  icon={<Icon component={MoreIcon} />}
                  onClick={onClickRemoveTab}
                  type="text"
                />
              </Dropdown>
            </div>
          )}
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} />}
      </div>
    </div>
  )

  return isMiniSize ? (
    <Tooltip
      title={tabName}
      placement="right"
      align={{
        offset: [6, 0],
      }}
    >
      {navLinkComp}
    </Tooltip>
  ) : (
    navLinkComp
  )
}

export default PCPinedTipiTab
