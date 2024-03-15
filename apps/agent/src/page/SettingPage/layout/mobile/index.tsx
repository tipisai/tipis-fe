import Icon from "@ant-design/icons"
import { FC } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { PreviousIcon } from "@illa-public/icon"
import { getCurrentTeamIdentifier } from "@illa-public/user-data"
import { SettingLayoutProps } from "../interface"
import {
  applyContentStyle,
  containerStyle,
  navStyle,
  prevIconStyle,
} from "./style"

const SettingMobileLayout: FC<SettingLayoutProps> = (props) => {
  const { children, withoutPadding } = props
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
    <div css={containerStyle}>
      <div css={navStyle}>
        <Icon
          component={PreviousIcon}
          css={prevIconStyle}
          onClick={clickBackBtn}
        />
      </div>
      <div css={applyContentStyle(withoutPadding)}>{children}</div>
    </div>
  )
}

export default SettingMobileLayout
