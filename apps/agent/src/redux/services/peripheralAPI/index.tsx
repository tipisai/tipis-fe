import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  HTTP_REQUEST_PUBLIC_BASE_URL,
  PERIPHERAL_REQUEST_PREFIX,
} from "@illa-public/illa-net"

export const peripheralAPI = createApi({
  reducerPath: "peripheralAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${PERIPHERAL_REQUEST_PREFIX}`,
  }),
  endpoints: (builder) => ({
    getWhiteListIP: builder.query<
      {
        resources: string[]
      },
      void
    >({
      query: () => ({
        url: `/meta`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetWhiteListIPQuery } = peripheralAPI
