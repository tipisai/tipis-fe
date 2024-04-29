import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { HTTP_REQUEST_PERIPHERAL_BASE_URL } from "@illa-public/illa-net"

export const peripheralAPI = createApi({
  reducerPath: "peripheralAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: HTTP_REQUEST_PERIPHERAL_BASE_URL,
  }),
  endpoints: (builder) => ({
    getWhiteListIP: builder.query<
      {
        resources: string[]
      },
      void
    >({
      query: () => ({
        url: `/v1/meta`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetWhiteListIPQuery } = peripheralAPI
