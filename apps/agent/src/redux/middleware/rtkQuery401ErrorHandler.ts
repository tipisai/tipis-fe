import { isRejectedWithValue } from "@reduxjs/toolkit"
import type { Middleware, MiddlewareAPI } from "@reduxjs/toolkit"
import { TipisTrack } from "@illa-public/track-utils"
import { teamAPI, userAPI } from "@illa-public/user-data"
import { getILLACloudURL, removeAuthToken } from "@illa-public/utils"
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
          TipisTrack.reset()
          window.location.href = `${getILLACloudURL()}/user/login?redirectURL=${encodeURIComponent(
            window.location.href,
          )}`
          break
        }
        default: {
          break
        }
      }
    }

    return next(action)
  }
