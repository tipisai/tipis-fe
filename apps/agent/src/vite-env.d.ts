/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly ILLA_API_BASE_URL: string
  readonly ILLA_CLOUD_URL: string
  readonly ILLA_MARKET_URL: string
  readonly ILLA_INSTANCE_ID: string
  readonly ILLA_APP_VERSION: string
  readonly ILLA_APP_ENV: string
  readonly ILLA_MUI_LICENSE: string
  readonly ILLA_POSTHOG_KEY: string
  readonly ILLA_INTERCOM_APP_ID: string
  readonly ILLA_USE_IN_CLIENT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
