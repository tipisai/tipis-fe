import { Global } from "@emotion/react"
import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
import { App as AntdContextProvider, ConfigProvider } from "antd"
import { HelmetProvider } from "react-helmet-async"
import ILLAThemConfig from "@/config/them/illa-theme.json"
import { ILLARouterProvider } from "./router/config"
import { globalStyle } from "./style"

function App() {
  return (
    <HelmetProvider>
      <ConfigProvider theme={ILLAThemConfig}>
        <AntdContextProvider component={false}>
          <Global styles={globalStyle} />
          <ILLARouterProvider />
          <UpgradeModalGroup />
        </AntdContextProvider>
      </ConfigProvider>
    </HelmetProvider>
  )
}

export default App
