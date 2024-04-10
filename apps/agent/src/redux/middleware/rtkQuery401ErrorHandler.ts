import { isRejectedWithValue } from "@reduxjs/toolkit"
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit"
import { teamAPI, userAPI } from "@illa-public/user-data"
import { removeAuthToken } from "@illa-public/utils"
import { isFetchBaseQueryError } from "../helper"

export const rtkQueryErrorLogger: Middleware =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action) && isFetchBaseQueryError(action.payload)) {
      switch (action.payload.status) {
        case 401: {
          removeAuthToken()
          dispatch(teamAPI.util.resetApiState())
          dispatch(userAPI.util.resetApiState())
          break
        }
        default: {
          break
        }
      }
    }

    return next(action)
  }
