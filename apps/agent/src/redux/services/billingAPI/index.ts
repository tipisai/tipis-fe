import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  CLOUD_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { TeamSubscription } from "@illa-public/upgrade-modal"
import { getAuthToken } from "@illa-public/utils"
import { IWooUsageInfoResponse } from "./interface"

export const billingAPI = createApi({
  reducerPath: "billingAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${CLOUD_REQUEST_PREFIX}`,
    prepareHeaders: (headers) => {
      const token = getAuthToken()
      if (token) {
        headers.set("Authorization", token)
      }
      return headers
    },
  }),

  endpoints: (builder) => ({
    // ---
    getPortalURL: builder.query<
      {
        url: string
      },
      {
        teamID: string
        returningURL: string
      }
    >({
      query: ({ teamID, returningURL }) => ({
        url: `/teams/${teamID}/billing/getPortalURL`,
        method: "POST",
        body: { returningURL },
      }),
    }),

    getWooUsageInfo: builder.query<
      IWooUsageInfoResponse,
      {
        teamID: string
        fromDate: string
        toDate: string
      }
    >({
      query: ({ teamID, fromDate, toDate }) => ({
        url: `/teams/${teamID}/billing/collaUsageInfo?fromDate=${encodeURI(
          fromDate,
        )}&toDate=${encodeURI(toDate)}`,
        method: "GET",
      }),
    }),

    getTeamSubscription: builder.query<TeamSubscription, string>({
      query: (teamID) => ({
        url: `/teams/${teamID}/billing`,
        method: "GET",
      }),
    }),

    // ---
  }),
})

// export const {
//   useLazyGetPortalURLQuery,
//   useLazyGetWooUsageInfoQuery,
//   useLazyGetTeamSubscriptionQuery,
//   useGetTeamSubscriptionQuery,
// } = billingAPI
