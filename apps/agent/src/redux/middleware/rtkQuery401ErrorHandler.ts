import { isRejectedWithValue } from "@reduxjs/toolkit"
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit"
import { removeAuthToken } from "@illa-public/utils"
import { isFetchBaseQueryError } from "../helper"

export const rtkQueryErrorLogger: Middleware =
  (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action) && isFetchBaseQueryError(action.payload)) {
      switch (action.payload.status) {
        case 401: {
          removeAuthToken()
          break
        }
        default: {
          break
        }
      }
    }

    return next(action)
  }
