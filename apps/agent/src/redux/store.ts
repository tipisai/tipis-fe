import {
  authAPI,
  currentUserReducer,
  teamReducer,
} from "@illa-public/user-data"
import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { agentAuthAPI } from "./services/agentAPI"

const store = configureStore({
  reducer: {
    team: teamReducer,
    currentUser: currentUserReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [agentAuthAPI.reducerPath]: agentAuthAPI.reducer,
  },
  devTools: import.meta.env.ILLA_APP_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(agentAuthAPI.middleware),
})

setupListeners(store.dispatch)

export default store
export type RootState = ReturnType<typeof store.getState>
