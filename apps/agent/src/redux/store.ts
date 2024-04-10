import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {
  authAPI,
  currentUserReducer,
  teamAPI,
  teamReducer,
  userAPI,
} from "@illa-public/user-data"
import { rtkQueryErrorLogger } from "./middleware/rtkQuery401ErrorHandler"
import { agentAuthAPI } from "./services/agentAPI"
import { driveAPI } from "./services/driveAPI"
import { marketAPI } from "./services/marketAPI"
import { uiReducer } from "./ui/slice"

const store = configureStore({
  reducer: {
    team: teamReducer,
    currentUser: currentUserReducer,
    ui: uiReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [agentAuthAPI.reducerPath]: agentAuthAPI.reducer,
    [marketAPI.reducerPath]: marketAPI.reducer,
    [driveAPI.reducerPath]: driveAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [teamAPI.reducerPath]: teamAPI.reducer,
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
      rtkQueryErrorLogger,
    ),
})

setupListeners(store.dispatch)

export default store
export type RootState = ReturnType<typeof store.getState>
