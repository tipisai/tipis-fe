import { Global } from "@emotion/react"
import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
import { HelmetProvider } from "react-helmet-async"
import { RouterProvider } from "react-router-dom"
import { MessageGroup, ModalGroup } from "@illa-design/react"
import ILLARoute from "./router"
import { globalStyle } from "./style"

function App() {
  return (
    <HelmetProvider>
      <Global styles={globalStyle} />
      <RouterProvider router={ILLARoute} />
      <MessageGroup />
      <UpgradeModalGroup />
      <ModalGroup />
    </HelmetProvider>
  )
}

export default App
