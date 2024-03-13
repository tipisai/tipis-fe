import Icon from "@ant-design/icons"
import { FC, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { NextIcon } from "@illa-public/icon"
import { ILLA_MIXPANEL_EVENT_TYPE } from "@illa-public/mixpanel-utils"
import { menuItemStyle, rightIconStyle } from "../style"
import { LandingMenuItemProps } from "./interface"

const menuEventReport = (a: any, b: any) => {}

export const Item: FC<LandingMenuItemProps> = ({ item }) => {
  const navigate = useNavigate()

  const selected = location.pathname === item.path
  const handleClick = (key: string) => {
    menuEventReport(key || "", ILLA_MIXPANEL_EVENT_TYPE.CLICK)
    navigate(key)
  }
  useEffect(() => {
    item.path && menuEventReport(item.path, ILLA_MIXPANEL_EVENT_TYPE.SHOW)
  }, [item.path])

  useEffect(() => {
    item.path &&
      selected &&
      menuEventReport(item.path, ILLA_MIXPANEL_EVENT_TYPE.SELECT)
  }, [item.path, selected])
  return (
    <div
      css={menuItemStyle}
      onClick={() => (item.onClick ? item.onClick() : handleClick(item.path))}
    >
      <div>{item.label}</div>
      <Icon component={NextIcon} css={rightIconStyle} />
    </div>
  )
}
