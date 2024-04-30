import { ConfigProvider, Switch, SwitchProps, ThemeConfig } from "antd"
import { forwardRef } from "react"
import BlackButtonTheme from "@/config/them/theme-blackButton.json"

const BlackSwitch = forwardRef<HTMLButtonElement, SwitchProps>(
  (antdSwitchProps, ref) => {
    return (
      <ConfigProvider theme={BlackButtonTheme as ThemeConfig}>
        <Switch {...antdSwitchProps} ref={ref} />
      </ConfigProvider>
    )
  },
)

BlackSwitch.displayName = "BlackSwitch"

export default BlackSwitch
