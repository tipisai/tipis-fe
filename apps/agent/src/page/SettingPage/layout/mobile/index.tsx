import Icon from "@ant-design/icons"
import { FC } from "react"
import { useMatch, useNavigate, useParams } from "react-router-dom"
import { PreviousIcon } from "@illa-public/icon"
import { getExploreTipisPath, getSettingPath } from "@/utils/routeHelper"
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
  const matchMobileSettingNav = useMatch("/setting/:teamIdentifier")
  const { teamIdentifier } = useParams()

  const clickBackBtn = () => {
    if (matchMobileSettingNav) {
      navigate(getExploreTipisPath(teamIdentifier!))
    } else {
      navigate(getSettingPath(teamIdentifier!))
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
