import { LicenseInfo } from "@mui/x-data-grid-premium"
import * as Sentry from "@sentry/react"
import { PostHogProvider } from "posthog-js/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { initGTMConfig } from "@illa-public/utils"
import "@/api/http/base"
import "@/i18n"
import { initI18n } from "@/i18n"
import App from "./App.tsx"
import store from "./redux/store.ts"

if (import.meta.env.ILLA_APP_ENV === "production") {
  Sentry.init({
    dsn: "https://c6853f0a62759ef3b650562f1a879658@o4507089449451520.ingest.us.sentry.io/4507105929330688",
    allowUrls: ["cloud.tipis.ai"],
  })
}

if (import.meta.env.ILLA_MUI_LICENSE) {
  LicenseInfo.setLicenseKey(import.meta.env.ILLA_MUI_LICENSE)
}

initGTMConfig()
initI18n().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <PostHogProvider
        apiKey={
          import.meta.env.ILLA_APP_ENV !== "production"
            ? ""
            : import.meta.env.ILLA_POSTHOG_KEY
        }
      >
        <Provider store={store}>
          <App />
        </Provider>
      </PostHogProvider>
    </StrictMode>,
  )
})
