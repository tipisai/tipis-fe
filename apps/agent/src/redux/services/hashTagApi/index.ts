import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  HTTP_REQUEST_PUBLIC_BASE_URL,
  MARKETPLACE_HASH_TAG_REQUEST_PREFIX,
} from "@illa-public/illa-net"
import { prepareHeaders } from "@illa-public/user-data"

const UNIT_TYPE_AI_AGENT = 29

export const hashTagApi = createApi({
  reducerPath: "hashTagApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${MARKETPLACE_HASH_TAG_REQUEST_PREFIX}`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getRecommendHashtag: builder.query<
      {
        hashtags: string[]
      },
      null
    >({
      query: () => {
        return {
          url: `/defaultHashtagsList/unitType/${UNIT_TYPE_AI_AGENT}`,
          method: "GET",
        }
      },
    }),

    getFuzzySearchHashTag: builder.query<
      {
        match: string[]
      },
      string
    >({
      query: (keyword) => {
        return {
          url: `/search?keyword=${keyword}`,
          method: "GET",
        }
      },
    }),
  }),
})

export const {
  useLazyGetRecommendHashtagQuery,
  useLazyGetFuzzySearchHashTagQuery,
} = hashTagApi
