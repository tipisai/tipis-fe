import { Global } from "@emotion/react"
import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
import { HelmetProvider } from "react-helmet-async"
import { MessageGroup, ModalGroup } from "@illa-design/react"
import { ILLARouterProvider } from "./router/config"
import { globalStyle } from "./style"

function App() {
  return (
    <HelmetProvider>
      <Global styles={globalStyle} />
      <ILLARouterProvider />
      <MessageGroup />
      <UpgradeModalGroup />
      <ModalGroup />
    </HelmetProvider>
  )
}

export default App
