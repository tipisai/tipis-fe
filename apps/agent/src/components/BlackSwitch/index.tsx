import { ConfigProvider, Switch, SwitchProps, ThemeConfig } from "antd"
import { FC } from "react"
import BlackButtonTheme from "@/config/them/theme-blackButton.json"

const BlackSwitch: FC<SwitchProps> = (antdSwitchProps) => {
  return (
    <ConfigProvider theme={BlackButtonTheme as ThemeConfig}>
      <Switch {...antdSwitchProps} />
    </ConfigProvider>
  )
}

export default BlackSwitch
