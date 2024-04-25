import { Global } from "@emotion/react"
import { App as AntdContextProvider, ConfigProvider, ThemeConfig } from "antd"
import { HelmetProvider } from "react-helmet-async"
import { IntercomProvider } from "react-use-intercom"
import { illaCodeMirrorTooltipStyle } from "@illa-public/code-editor-new/CodeMirror/theme"
import tipisThemConfig from "@/config/them/theme-tipis.json"
import { ILLARouterProvider } from "./router/config"
import { globalStyle } from "./style"
import AntdStore from "./utils/antdStore"

function App() {
  return (
    <ConfigProvider
      theme={tipisThemConfig as ThemeConfig}
      wave={{ disabled: true }}
    >
      <AntdContextProvider component={false}>
        <AntdStore />
        <HelmetProvider>
          <Global styles={globalStyle} />
          <IntercomProvider appId={import.meta.env.ILLA_INTERCOM_APP_ID}>
            <ILLARouterProvider />
          </IntercomProvider>
          <div
            className="illaCodeMirrorWrapper"
            css={illaCodeMirrorTooltipStyle}
          />
        </HelmetProvider>
      </AntdContextProvider>
    </ConfigProvider>
  )
}

export default App
