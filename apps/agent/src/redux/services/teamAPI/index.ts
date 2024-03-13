import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { v4 } from "uuid"
import {
  CLOUD_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { TeamInfo } from "@illa-public/public-types"
import { getAuthToken } from "@illa-public/utils"

export const teamAPI = createApi({
  reducerPath: "teamAPI",
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
    getTeamsInfo: builder.query<TeamInfo[], {}>({
      query: () => ({
        url: "/teams/my",
        method: "GET",
      }),
    }),

    deleteTeamByID: builder.mutation<undefined, string>({
      query: (teamID) => ({
        method: "DELETE",
        url: `/teams/${teamID}`,
      }),
    }),

    removeTeamMemberByID: builder.mutation<
      undefined,
      {
        teamID: string
        teamMemberID: string
      }
    >({
      query: ({ teamID, teamMemberID }) => ({
        method: "DELETE",
        url: `/teams/${teamID}/teamMembers/${teamMemberID}`,
      }),
    }),

    fetchChangeTeamConfig: builder.mutation<
      undefined,
      {
        teamID: string
        data: {
          name?: string
          identifier?: string
          icon?: string
        }
      }
    >({
      query: ({ teamID, data }) => ({
        method: "PATCH",
        url: `/teams/${teamID}/config`,
        body: data,
      }),
    }),

    getTeamIconUploadAddress: builder.query<
      {
        uploadAddress: string
      },
      {
        teamID: string
        type: string
      }
    >({
      query: ({ teamID, type }) => {
        const fileName = v4()
        return {
          url: `/teams/${teamID}icon/uploadAddress/fileName/${fileName}.${type}`,
          method: "GET",
        }
      },
    }),
    // ---
  }),
})

// export const {
//   useLazyGetTeamsInfoQuery,
//   useDeleteTeamByIDMutation,
//   useRemoveTeamMemberByIDMutation,
//   useLazyGetTeamIconUploadAddressQuery,
// } = teamAPI
