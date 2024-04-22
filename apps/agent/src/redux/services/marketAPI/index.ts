import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { isEqual } from "lodash-es"
import {
  HTTP_REQUEST_PUBLIC_BASE_URL,
  MARKETPLACE_AUTH_PRODUCT_REQUEST_PREFIX,
} from "@illa-public/illa-net"
import { IMarketAIAgent, IMarketAgentListData } from "@illa-public/public-types"
import { prepareHeaders } from "@illa-public/user-data"
import { INITIAL_PAGE, MARKET_LIST_LIMIT } from "./constants"
import { ProductListParams } from "./interface"

export const marketAPI = createApi({
  reducerPath: "marketAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${MARKETPLACE_AUTH_PRODUCT_REQUEST_PREFIX}`,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ["MarketProducts"],
  endpoints: (builder) => ({
    getAIAgentMarketplaceInfo: builder.query<
      IMarketAIAgent,
      {
        aiAgentID: string
      }
    >({
      query: ({ aiAgentID }) => `/aiAgents/${aiAgentID}`,
    }),

    getMarketList: builder.query<IMarketAgentListData, ProductListParams>({
      query: (params) => ({
        url: "/aiAgents",
        method: "GET",
        params: {
          ...params,
          limit: MARKET_LIST_LIMIT,
        },
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === INITIAL_PAGE) {
          return newItems
        }
        return {
          ...currentCache,
          ...newItems,
          products: [...currentCache.products, ...newItems.products],
        }
      },

      forceRefetch({ currentArg, previousArg }) {
        return !isEqual(currentArg, previousArg)
      },
      providesTags: (result) =>
        result?.products
          ? [
              ...result?.products.map(({ aiAgent }) => ({
                type: "MarketProducts" as const,
                id: aiAgent.aiAgentID,
              })),
              { type: "MarketProducts", id: "MARKET-LIST" },
            ]
          : [{ type: "MarketProducts", id: "MARKET-LIST" }],
    }),

    contributeAgentWithHashtags: builder.mutation<
      void,
      {
        teamID: string
        tipisID: string
        hashtags: string[]
        publishConfiguration: boolean
      }
    >({
      query: ({ teamID, tipisID, hashtags, publishConfiguration }) => ({
        url: `/teams/${teamID}/products/aiAgents/${tipisID}/recontributeWith?property=hashtags,publishConfiguration`,
        method: "POST",
        data: {
          hashtags,
          publishConfiguration,
        },
      }),
      invalidatesTags: [{ type: "MarketProducts", id: "MARKET-LIST" }],
    }),

    updateAgentContribute: builder.mutation<
      void,
      {
        teamID: string
        tipisID: string
        hashtags: string[]
        publishConfiguration: boolean
      }
    >({
      query: ({ teamID, tipisID, hashtags, publishConfiguration }) => ({
        url: `/teams/${teamID}/products/aiAgents/${tipisID}/updatePropertyWith?property=hashtags,publishConfiguration`,
        method: "POST",
        data: {
          hashtags,
          publishConfiguration,
        },
      }),
    }),
  }),
})

export const {
  useGetAIAgentMarketplaceInfoQuery,
  useLazyGetMarketListQuery,
  useGetMarketListQuery,
  useContributeAgentWithHashtagsMutation,
  useUpdateAgentContributeMutation,
} = marketAPI
