import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  BUILDER_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { IBaseIntegration } from "@illa-public/public-types"
import { prepareHeaders } from "@illa-public/user-data"

export const integrationAPI = createApi({
  reducerPath: "integrationAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${BUILDER_REQUEST_PREFIX}`,
    prepareHeaders: prepareHeaders,
  }),
  endpoints: (builder) => ({
    getIntegrationList: builder.query<IBaseIntegration[], string>({
      query: (teamID) => ({
        url: `/teams/${teamID}/resources`,
        method: "GET",
      }),
    }),
    updateIntegrationByID: builder.mutation<
      IBaseIntegration,
      {
        teamID: string
        integrationID: string
        integrationData: IBaseIntegration
      }
    >({
      query: ({ teamID, integrationID, integrationData }) => ({
        url: `/teams/${teamID}/resources/${integrationID}`,
        method: "PUT",
        body: integrationData,
      }),
      onQueryStarted: async (
        { integrationID, integrationData, teamID },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          integrationAPI.util.updateQueryData(
            "getIntegrationList",
            teamID,
            (draft) => {
              const targetIntegration = draft.find(
                (integration) => integration.resourceID === integrationID,
              )
              if (targetIntegration) {
                Object.assign(targetIntegration, integrationData)
              }
            },
          ),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
    createIntegration: builder.mutation<
      IBaseIntegration,
      {
        teamID: string
        integrationData: IBaseIntegration
      }
    >({
      query: ({ teamID, integrationData }) => ({
        url: `/teams/${teamID}/resources`,
        method: "POST",
        body: integrationData,
      }),
      onQueryStarted: async ({ teamID }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(
            integrationAPI.util.updateQueryData(
              "getIntegrationList",
              teamID,
              (draft) => {
                draft.unshift(data)
              },
            ),
          )
        } catch {}
      },
    }),
    deleteIntegrationByID: builder.mutation<
      IBaseIntegration,
      {
        teamID: string
        integrationID: string
      }
    >({
      query: ({ teamID, integrationID }) => ({
        url: `/teams/${teamID}/resources/${integrationID}`,
        method: "DELETE",
      }),
      onQueryStarted: async (
        { teamID, integrationID },
        { dispatch, queryFulfilled },
      ) => {
        const pathResult = dispatch(
          integrationAPI.util.updateQueryData(
            "getIntegrationList",
            teamID,
            (draft) => {
              const targetIndex = draft.findIndex(
                (integration) => integration.resourceID === integrationID,
              )
              if (targetIndex !== -1) {
                draft.splice(targetIndex, 1)
              }
            },
          ),
        )
        try {
          await queryFulfilled
        } catch {
          pathResult.undo()
        }
      },
    }),
  }),
})

export const {
  useCreateIntegrationMutation,
  useGetIntegrationListQuery,
  useUpdateIntegrationByIDMutation,
  useDeleteIntegrationByIDMutation,
} = integrationAPI
