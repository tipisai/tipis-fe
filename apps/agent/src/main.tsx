import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact, { BugsnagErrorBoundary } from "@bugsnag/plugin-react"
import { LicenseInfo } from "@mui/x-data-grid-premium"
import { PostHogProvider } from "posthog-js/react"
import { StrictMode } from "react"
import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { initGTMConfig } from "@illa-public/utils"
import "@/api/http/base"
import "@/i18n"
import { initI18n } from "@/i18n"
import App from "./App.tsx"
import store from "./redux/store.ts"

Bugsnag.start({
  apiKey: "a59ca89c3b66725e12abb0be6a68fbd3",
  plugins: [new BugsnagPluginReact()],
  autoDetectErrors: import.meta.env.ILLA_APP_ENV === "production",
})

// eslint-disable-next-line react-refresh/only-export-components
const ErrorBoundary = Bugsnag.getPlugin("react")?.createErrorBoundary(
  React,
) as BugsnagErrorBoundary

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
        <ErrorBoundary>
          <Provider store={store}>
            <App />
          </Provider>
        </ErrorBoundary>
      </PostHogProvider>
      ,
    </StrictMode>,
  )
})
