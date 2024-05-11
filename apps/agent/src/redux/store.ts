import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {
  authAPI,
  supabaseApi,
  teamAPI,
  teamReducer,
  userAPI,
} from "@illa-public/user-data"
import { rtkQueryErrorLogger } from "./middleware/rtkQuery401ErrorHandler"
import { agentAuthAPI } from "./services/agentAPI"
import { aiToolsAPI } from "./services/aiToolsAPI"
import { driveAPI } from "./services/driveAPI"
import { hashTagApi } from "./services/hashTagApi"
import { integrationAPI } from "./services/integrationAPI"
import { marketAPI } from "./services/marketAPI"
import { peripheralAPI } from "./services/peripheralAPI"
import { uiReducer } from "./ui/slice"

const store = configureStore({
  reducer: {
    team: teamReducer,
    ui: uiReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [agentAuthAPI.reducerPath]: agentAuthAPI.reducer,
    [marketAPI.reducerPath]: marketAPI.reducer,
    [driveAPI.reducerPath]: driveAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [teamAPI.reducerPath]: teamAPI.reducer,
    [hashTagApi.reducerPath]: hashTagApi.reducer,
    [integrationAPI.reducerPath]: integrationAPI.reducer,
    [peripheralAPI.reducerPath]: peripheralAPI.reducer,
    [aiToolsAPI.reducerPath]: aiToolsAPI.reducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
  },
  devTools: import.meta.env.ILLA_APP_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      agentAuthAPI.middleware,
      marketAPI.middleware,
      driveAPI.middleware,
      userAPI.middleware,
      teamAPI.middleware,
      hashTagApi.middleware,
      integrationAPI.middleware,
      peripheralAPI.middleware,
      aiToolsAPI.middleware,
      supabaseApi.middleware,
      rtkQueryErrorLogger,
    ),
})

setupListeners(store.dispatch)

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
