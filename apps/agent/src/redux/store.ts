import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {
  authAPI,
  currentUserReducer,
  teamReducer,
} from "@illa-public/user-data"
import { agentAuthAPI } from "./services/agentAPI"
import { marketAPI } from "./services/marketAPI"

const store = configureStore({
  reducer: {
    team: teamReducer,
    currentUser: currentUserReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [agentAuthAPI.reducerPath]: agentAuthAPI.reducer,
    [marketAPI.reducerPath]: marketAPI.reducer,
  },
  devTools: import.meta.env.ILLA_APP_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      agentAuthAPI.middleware,
      marketAPI.middleware,
    ),
})

setupListeners(store.dispatch)

export default store
export type RootState = ReturnType<typeof store.getState>
