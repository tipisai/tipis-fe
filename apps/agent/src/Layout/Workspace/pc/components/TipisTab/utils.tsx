import Icon from "@ant-design/icons"
import { Avatar } from "antd"
import { PenIcon } from "@illa-public/icon"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
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
    case TAB_TYPE.CHAT:
    case TAB_TYPE.EXPLORE_TIPIS:
    case TAB_TYPE.EXPLORE_FUNCTION:
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
    case TAB_TYPE.EXPLORE_FUNCTION:
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
      return `/workspace/${teamIdentifier}/tipis/create/${cacheID}`
    case TAB_TYPE.EDIT_TIPIS:
      return `/workspace/${teamIdentifier}/tipis/edit/${cacheID}`
    case TAB_TYPE.CHAT:
      return `/workspace/${teamIdentifier}/tipis/create/${cacheID}`
    case TAB_TYPE.CREATE_FUNCTION:
    case TAB_TYPE.EDIT_FUNCTION:
    case TAB_TYPE.EXPLORE_TIPIS:
    case TAB_TYPE.EXPLORE_FUNCTION:
    case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
    case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
      return ""
  }
}
