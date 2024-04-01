import Icon from "@ant-design/icons"
import { Avatar } from "antd"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { PenIcon } from "@illa-public/icon"
import ChatIcon from "@/assets/public/tipiChatAvatar.svg?react"
import FunctionIcon from "@/assets/workspace/function.svg?react"
import MarketplaceIcon from "@/assets/workspace/marketplace.svg?react"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { DEFAULT_CHAT_ID } from "@/redux/ui/recentTab/state"
import {
  getChatPath,
  getCreateFunctionPath,
  getCreateTipiPath,
  getEditFunctionPath,
  getEditTipiPath,
  getExploreFunctionsPath,
  getExploreTipisPath,
  getMarketTipiDetailPath,
  getRunTipiPath,
  getTipiDetailPath,
} from "@/utils/routeHelper"
import {
  chatIconStyle,
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
    case TAB_TYPE.RUN_TIPIS:
      return (
        <span css={menuItemButtonIconContainerStyle}>
          <Icon component={ChatIcon} />
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
      return <Icon component={ChatIcon} css={chatIconStyle} />
    case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
    case TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL:
    case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
      return <div />
  }
}

export const useGetTabName = () => {
  const { t } = useTranslation()

  const getTabName = useCallback(
    (tabName: string, tabType: TAB_TYPE, tabID: string) => {
      if (tabName) return tabName
      switch (tabType) {
        case TAB_TYPE.CREATE_TIPIS:
          return t("homepage.left_panel.tab.create_tipi")
        case TAB_TYPE.EDIT_TIPIS:
          return "Edit tipi"
        case TAB_TYPE.RUN_TIPIS:
          return "Run tipi"
        case TAB_TYPE.CHAT:
          return tabID === DEFAULT_CHAT_ID
            ? t("homepage.left_panel.tab.default_tipi_chat")
            : t("homepage.left_panel.tab.tipi_chat")
        case TAB_TYPE.CREATE_FUNCTION:
          return "Create Function"
        case TAB_TYPE.EDIT_FUNCTION:
          return "Edit Function"
        case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
        case TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL:
        case TAB_TYPE.EXPLORE_TIPIS:
          return t("homepage.left_panel.tab.explore_tipi")
        case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
        case TAB_TYPE.EXPLORE_FUNCTION:
          return "Explore function"
      }
    },
    [t],
  )

  return getTabName
}

export const genTabNavigateLink = (
  teamIdentifier: string = "",
  tabType: TAB_TYPE,
  cacheID: string,
  tabID: string,
) => {
  switch (tabType) {
    case TAB_TYPE.CREATE_TIPIS:
      return getCreateTipiPath(teamIdentifier)
    case TAB_TYPE.EDIT_TIPIS:
      return getEditTipiPath(teamIdentifier, cacheID)
    case TAB_TYPE.RUN_TIPIS:
      return `${getRunTipiPath(teamIdentifier, cacheID)}/${tabID ? tabID : ""}`
    case TAB_TYPE.CHAT:
      return getChatPath(teamIdentifier, cacheID)
    case TAB_TYPE.CREATE_FUNCTION:
      return getCreateFunctionPath(teamIdentifier, cacheID)
    case TAB_TYPE.EDIT_FUNCTION:
      return getEditFunctionPath(teamIdentifier, cacheID)
    case TAB_TYPE.EXPLORE_TIPIS:
      return getExploreTipisPath(teamIdentifier)
    case TAB_TYPE.EXPLORE_FUNCTION:
      return getExploreFunctionsPath(teamIdentifier)
    case TAB_TYPE.EXPLORE_TIPIS_DETAIL:
      return getTipiDetailPath(teamIdentifier, cacheID)
    case TAB_TYPE.EXPLORE_MARKET_TIPIS_DETAIL:
      return getMarketTipiDetailPath(teamIdentifier, cacheID)
    case TAB_TYPE.EXPLORE_MARKET_FUNCTION_DETAIL:
    case TAB_TYPE.EXPLORE_FUNCTION_DETAIL:
      return ""
  }
}
