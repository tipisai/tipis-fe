import Icon from "@ant-design/icons"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { NextIcon } from "@illa-public/icon"
import { menuItemStyle, rightIconStyle } from "../style"
import { LandingMenuItemProps } from "./interface"

export const Item: FC<LandingMenuItemProps> = ({ item }) => {
  const navigate = useNavigate()

  const handleClick = (key: string) => {
    navigate(key)
  }

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
