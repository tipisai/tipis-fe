import { LicenseInfo } from "@mui/x-data-grid-premium"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import "@/api/http/base"
import "@/i18n"
import App from "./App.tsx"
import store from "./redux/store.ts"

if (import.meta.env.ILLA_MUI_LICENSE) {
  LicenseInfo.setLicenseKey(import.meta.env.ILLA_MUI_LICENSE)
}

ILLAMixpanel.setDeviceID()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
