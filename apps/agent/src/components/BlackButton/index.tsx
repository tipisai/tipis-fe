import { Button, ButtonProps, ConfigProvider, ThemeConfig } from "antd"
import { FC } from "react"
import BlackButtonTheme from "@/config/them/theme-blackButton.json"

const BlackButton: FC<ButtonProps> = (props) => {
  const { children, type = "primary", ...antdButtonProps } = props
  return (
    <ConfigProvider theme={BlackButtonTheme as ThemeConfig}>
      <Button {...antdButtonProps} type={type}>
        {children}
      </Button>
    </ConfigProvider>
  )
}

export default BlackButton
