import {
  HTTP_REQUEST_PUBLIC_BASE_URL,
  MARKETPLACE_AUTH_PRODUCT_REQUEST_PREFIX,
} from "@illa-public/illa-net"
import { MarketAIAgent } from "@illa-public/market-agent"
import { getAuthToken } from "@illa-public/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const marketAPI = createApi({
  reducerPath: "marketAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${MARKETPLACE_AUTH_PRODUCT_REQUEST_PREFIX}`,
    prepareHeaders: (headers) => {
      const token = getAuthToken()
      if (token) {
        headers.set("Authorization", token)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getAIAgentMarketplaceInfo: builder.query<
      MarketAIAgent,
      {
        aiAgentID: string
      }
    >({
      query: ({ aiAgentID }) => `/aiAgents/${aiAgentID}`,
    }),
    starAIAgent: builder.mutation<{}, string>({
      query: (aiAgentID) => ({
        url: `/aiAgents/${aiAgentID}/star`,
        method: "POST",
      }),
    }),
    unstarAIAgent: builder.mutation<{}, string>({
      query: (aiAgentID) => ({
        url: `/aiAgents/${aiAgentID}/star`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetAIAgentMarketplaceInfoQuery,
  useStarAIAgentMutation,
  useUnstarAIAgentMutation,
} = marketAPI
