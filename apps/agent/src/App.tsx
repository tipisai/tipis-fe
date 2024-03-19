import { Global } from "@emotion/react"
import { App as AntdContextProvider, ConfigProvider, ThemeConfig } from "antd"
import { HelmetProvider } from "react-helmet-async"
import tipisThemConfig from "@/config/them/theme-tipis.json"
import { illaCodeMirrorTooltipStyle } from "./components/CodeEditor/CodeMirror/theme"
import { ILLARouterProvider } from "./router/config"
import { globalStyle } from "./style"

function App() {
  return (
    <HelmetProvider>
      <ConfigProvider theme={tipisThemConfig as ThemeConfig}>
        <AntdContextProvider component={false}>
          <Global styles={globalStyle} />
          <ILLARouterProvider />
          <div
            className="illaCodeMirrorWrapper"
            css={illaCodeMirrorTooltipStyle}
          />
        </AntdContextProvider>
      </ConfigProvider>
    </HelmetProvider>
  )
}

export default App
