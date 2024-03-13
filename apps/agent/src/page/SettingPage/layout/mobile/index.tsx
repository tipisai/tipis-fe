import Icon from "@ant-design/icons"
import { FC } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { PreviousIcon } from "@illa-public/icon"
import { getCurrentTeamIdentifier } from "@illa-public/user-data"
import { SettingMobileLayoutProps } from "./interface"
import {
  applyContentStyle,
  mobileTitleStyle,
  navStyle,
  prevIconStyle,
  wrapperStyle,
} from "./style"

const SettingMobileLayout: FC<SettingMobileLayoutProps> = (props) => {
  const { children, navRight, withoutPadding, title } = props
  const navigate = useNavigate()
  const history = useLocation()

  const currentTeamIdentifier = useSelector(getCurrentTeamIdentifier)
  const extraPath = history.pathname.split("/")[2]

  const clickBackBtn = () => {
    if (Boolean(extraPath)) {
      navigate(`/setting/${currentTeamIdentifier}`)
    } else {
      currentTeamIdentifier
        ? navigate(`/workspace/${currentTeamIdentifier}`)
        : navigate("/workspace")
    }
  }

  return (
    <div css={wrapperStyle}>
      <div css={navStyle}>
        <Icon
          component={PreviousIcon}
          css={prevIconStyle}
          onClick={clickBackBtn}
        />
        {navRight}
      </div>
      <div css={applyContentStyle(withoutPadding)}>
        {title && <div css={mobileTitleStyle}>{title}</div>}
        {children}
      </div>
    </div>
  )
}

SettingMobileLayout.displayName = "SettingMobileLayout"

export default SettingMobileLayout
