import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import "@/api/http/base"
import "@/i18n"
import App from "./App.tsx"
import store from "./redux/store.ts"

ILLAMixpanel.setDeviceID()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
