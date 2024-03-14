import Icon from "@ant-design/icons"
import { Avatar } from "antd"
import { PenIcon } from "@illa-public/icon"
import FunctionIcon from "@/assets/workspace/function.svg?react"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import {
  getCreateFunctionPath,
  getCreateTipiPath,
  getEditFunctionPath,
  getEditTipiPath,
  getExploreFunctionsPath,
  getExploreTipisPath,
  getRunTipiPath,
} from "@/utils/routeHelper"
import {
  menuItemButtonCustomIconContainerStyle,
  menuItemButtonIconContainerStyle,
} from "./style"

export const getIconByTabInfo = (icon: string, tabType: TAB_TYPE) => {
  if (icon) {
    return (
      <span css={menuItemButtonCustomIconContainerStyle}>
        <Avatar src={icon} shape="circle" size={24} />
      </span>
    )
  }
  switch (tabType) {
    case TAB_TYPE.CREATE_TIPIS:
    case TAB_TYPE.EDIT_TIPIS:
    case TAB_TYPE.CREATE_FUNCTION:
    case TAB_TYPE.EDIT_FUNCTION:
      return (
        <span css={menuItemButtonIconContainerStyle}>
          <Icon component={PenIcon} />
        </span>
      )
    case TAB_TYPE.EXPLORE_TIPIS:
      return (
        <span css={menuItemButtonIconContainerStyle}>
          <Icon component={MarketplaceIcon} />
        </span>
      )
    case TAB_TYPE.EXPLORE_FUNCTION:
      return (
        <span css={menuItemButtonIconContainerStyle}>
          <Icon component={FunctionIcon} />
        </span>
      )
    case TAB_TYPE.CHAT:
    case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
    case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
      return <div />
  }
}

export const getTabName = (tabName: string, tabType: TAB_TYPE) => {
  if (tabName) return tabName
  switch (tabType) {
    case TAB_TYPE.CREATE_TIPIS:
    case TAB_TYPE.EDIT_TIPIS:
      return "Edit tipi"
    case TAB_TYPE.CHAT:
      return "Default chat"
    case TAB_TYPE.CREATE_FUNCTION:
    case TAB_TYPE.EDIT_FUNCTION:
    case TAB_TYPE.EXPLORE_TIPIS:
      return "Explore tipis"
    case TAB_TYPE.EXPLORE_FUNCTION:
      return "Explore function"
    case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
    case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
      return "xxxxx"
  }
}

export const genTabNavigateLink = (
  teamIdentifier: string,
  tabType: TAB_TYPE,
  cacheID: string,
) => {
  switch (tabType) {
    case TAB_TYPE.CREATE_TIPIS:
      return getCreateTipiPath(teamIdentifier, cacheID)
    case TAB_TYPE.EDIT_TIPIS:
      return getEditTipiPath(teamIdentifier, cacheID)
    case TAB_TYPE.CHAT:
      return getRunTipiPath(teamIdentifier, cacheID)
    case TAB_TYPE.CREATE_FUNCTION:
      return getCreateFunctionPath(teamIdentifier, cacheID)
    case TAB_TYPE.EDIT_FUNCTION:
      return getEditFunctionPath(teamIdentifier, cacheID)
    case TAB_TYPE.EXPLORE_TIPIS:
      return getExploreTipisPath(teamIdentifier)
    case TAB_TYPE.EXPLORE_FUNCTION:
      return getExploreFunctionsPath(teamIdentifier)
    case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
    case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
      return ""
  }
}
