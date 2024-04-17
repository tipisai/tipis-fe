import Icon from "@ant-design/icons"
import { Avatar, Button, Tooltip } from "antd"
import { FC, MouseEventHandler, useRef } from "react"
import { useSelector } from "react-redux"
import { MinusIcon } from "@illa-public/icon"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { useGetCurrentTeamInfo } from "@/utils/team"
import DropIndicator from "../../DropIndicator/DropIndicator"
import {
  baseActionIconContainerStyle,
  baseMenuItemContainerStyle,
  baseOuterContainerStyle,
  basePCMenuItemButtonCustomIconContainerStyle,
  draggingStyle,
} from "../../baseTabStyle"
import { useTabSortableItem } from "../../hook"
import { menuItemNameStyle, menuItemStyle } from "../style"
import { IPCPinedTipisTab } from "./interface"

const PinedTipiTab: FC<IPCPinedTipisTab> = (props) => {
  const { tipiID, isMiniSize, index } = props
  const pinedTipiTabInfo = useSelector((state) =>
    getPinedTipisByTipisID(state, tipiID),
  )!
  const currentTeamInfo = useGetCurrentTeamInfo()

  const { tipiIcon, tipiName, tipiOwnerTeamIdentity } = pinedTipiTabInfo
  const isCurrentUserTeam =
    currentTeamInfo?.identifier === tipiOwnerTeamIdentity

  const ref = useRef<HTMLDivElement>(null)

  const { closestEdge, draggableState } = useTabSortableItem(
    index,
    pinedTipiTabInfo ? { ...pinedTipiTabInfo } : undefined,
    ref,
  )

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
    >
      <div css={menuItemStyle}>
        <div
          css={baseMenuItemContainerStyle(isMiniSize)}
          className="menu-item-inner-container"
        >
          <span css={basePCMenuItemButtonCustomIconContainerStyle}>
            <Avatar src={tipiIcon} shape="circle" size={24} />
          </span>
          {!isMiniSize && <span css={menuItemNameStyle}>{tipiName}</span>}
          {!isMiniSize && (
            <div css={baseActionIconContainerStyle} className="delete-button">
              <Button
                size="small"
                icon={<Icon component={MinusIcon} />}
                onClick={onClickRemoveTab}
                type="text"
              />
            </div>
          )}
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} />}
      </div>
    </div>
  )

  return isMiniSize ? (
    <Tooltip
      title={tipiName}
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

export default PinedTipiTab
