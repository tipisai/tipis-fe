import { ConfigProvider, Tabs, TabsProps, ThemeConfig } from "antd"
import { FC } from "react"
import BlackButtonTheme from "@/config/them/theme-blackButton.json"

const BlackTabs: FC<TabsProps> = (props) => {
  const { children, ...antdTabsProps } = props
  return (
    <ConfigProvider theme={BlackButtonTheme as ThemeConfig}>
      <Tabs {...antdTabsProps}>{children}</Tabs>
    </ConfigProvider>
  )
}

export default BlackTabs
