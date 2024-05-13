import Icon from "@ant-design/icons"
import { FC } from "react"
import { useMatch, useNavigate } from "react-router-dom"
import { PreviousIcon } from "@illa-public/icon"
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
  const matchMobileSettingNav = useMatch("/setting")

  const clickBackBtn = () => {
    if (matchMobileSettingNav) {
      navigate(-1)
    } else {
      navigate("/setting")
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
