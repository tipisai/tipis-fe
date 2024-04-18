import Icon from "@ant-design/icons"
import { Avatar, Button } from "antd"
import { FC, MouseEventHandler } from "react"
import { useSelector } from "react-redux"
import { MinusIcon } from "@illa-public/icon"
import { getPinedTipisByTipisID } from "@/redux/ui/pinedTipis/selector"
import { useGetCurrentTeamInfo } from "@/utils/team"
import {
  baseActionIconContainerStyle,
  baseMenuItemContainerStyle,
  baseOuterContainerStyle,
  basePCMenuItemButtonCustomIconContainerStyle,
} from "../../baseTabStyle"
import { menuItemNameStyle, menuItemStyle } from "../style"
import { IMobilePinedTipisTab } from "./interface"

const MobileTipisTab: FC<IMobilePinedTipisTab> = (props) => {
  const { tipiID } = props
  const pinedTipiTabInfo = useSelector((state) =>
    getPinedTipisByTipisID(state, tipiID),
  )!
  const currentTeamInfo = useGetCurrentTeamInfo()

  const { tabIcon, tabName, tipiOwnerTeamIdentity } = pinedTipiTabInfo
  const isCurrentUserTeam =
    currentTeamInfo?.identifier === tipiOwnerTeamIdentity

  const onClickRemoveTab: MouseEventHandler<HTMLElement> = async (e) => {
    e.stopPropagation()
  }

  const onClick = () => {
    if (isCurrentUserTeam) {
    }
  }

  return (
    <div onClick={onClick} css={baseOuterContainerStyle(false)}>
      <div css={menuItemStyle}>
        <div
          css={baseMenuItemContainerStyle(false)}
          className="menu-item-inner-container"
        >
          <span css={basePCMenuItemButtonCustomIconContainerStyle}>
            <Avatar src={tabIcon} shape="circle" size={24} />
          </span>
          <span css={menuItemNameStyle}>{tabName}</span>
          <div css={baseActionIconContainerStyle} className="delete-button">
            <Button
              size="small"
              icon={<Icon component={MinusIcon} />}
              onClick={onClickRemoveTab}
              type="text"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileTipisTab
