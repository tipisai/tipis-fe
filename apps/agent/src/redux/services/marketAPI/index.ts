import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  HTTP_REQUEST_PUBLIC_BASE_URL,
  MARKETPLACE_AUTH_PRODUCT_REQUEST_PREFIX,
} from "@illa-public/illa-net"
import { MarketAgentListData } from "@illa-public/market-agent"
import { MarketAIAgent } from "@illa-public/public-types"
import { getAuthToken } from "@illa-public/utils"
import { ProductListParams } from "./interface"

HTTP_REQUEST_PUBLIC_BASE_URL

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
  tagTypes: ["MarketProducts"],
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

    getMarketList: builder.query<
      MarketAgentListData,
      {
        params: ProductListParams
      }
    >({
      query: ({ params }) => ({
        url: "/aiAgents",
        method: "GET",
        params: params,
      }),
      providesTags: (result) =>
        result?.products
          ? [
              ...result?.products.map(({ aiAgent }) => ({
                type: "MarketProducts" as const,
                id: aiAgent.aiAgentID,
              })),
              { type: "MarketProducts", id: "PARTIAL-LIST" },
            ]
          : [{ type: "MarketProducts", id: "PARTIAL-LIST" }],
    }),
  }),
})

export const {
  useGetAIAgentMarketplaceInfoQuery,
  useStarAIAgentMutation,
  useUnstarAIAgentMutation,
  useLazyGetMarketListQuery,
  useGetMarketListQuery,
} = marketAPI
