import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { v4 } from "uuid"
import {
  AGENT_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { Agent, AgentRaw } from "@illa-public/public-types"
import { prepareHeaders } from "@illa-public/user-data"
import { getFileExtensionFromBase64 } from "@/utils/file"

export const agentAuthAPI = createApi({
  reducerPath: "agentAuthAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${AGENT_REQUEST_PREFIX}`,
    prepareHeaders: prepareHeaders,
  }),
  tagTypes: ["Agents"],
  endpoints: (builder) => ({
    getAgentDetail: builder.query<
      Agent,
      {
        aiAgentID: string
        teamID: string
      }
    >({
      query: ({ aiAgentID, teamID }) => `/teams/${teamID}/aiAgent/${aiAgentID}`,
    }),
    getAgentContributeState: builder.query<
      {
        isPublishedToMarketplace: boolean
      },
      {
        aiAgentID: string
        ownerTeamIdentifier: string
      }
    >({
      query: ({ aiAgentID, ownerTeamIdentifier }) =>
        `/teams/byIdentifier/${ownerTeamIdentifier}/publicAIAgent/${aiAgentID}/isPublishedToMarketplace`,
    }),
    getContributedAgentDetail: builder.query<
      Agent,
      { aiAgentID: string; ownerTeamIdentifier: string }
    >({
      query: ({ aiAgentID, ownerTeamIdentifier }) =>
        `/teams/byIdentifier/${ownerTeamIdentifier}/publicAIAgent/${aiAgentID}`,
    }),
    getAIAgentAnonymousAddress: builder.query<
      {
        aiAgentConnectionAddress: string
      },
      string
    >({
      query: (teamID) => `/teams/${teamID}/aiAgentAnonymous/connectionAddress`,
    }),
    getAIAgentWsAddress: builder.query<
      { aiAgentConnectionAddress: string },
      {
        teamID: string
        aiAgentID: string
      }
    >({
      query: ({ teamID, aiAgentID }) =>
        `/teams/${teamID}/aiAgent/${aiAgentID}/connectionAddress`,
    }),
    duplicateAIAgent: builder.mutation<
      Agent,
      {
        teamID: string
        aiAgentID: string
      }
    >({
      query: ({ teamID, aiAgentID }) => ({
        url: `/teams/${teamID}/aiAgent/${aiAgentID}/duplicate`,
        method: "POST",
      }),
      async onQueryStarted(
        { teamID, aiAgentID },
        { dispatch, queryFulfilled },
      ) {
        const templateID = v4()
        const patchResult = dispatch(
          agentAuthAPI.util.updateQueryData(
            "getAIAgentListByPage",
            { teamID },
            (draft) => {
              const targetAgent = draft.aiAgentList?.find(
                (agent) => agent.aiAgentID === aiAgentID,
              )
              if (targetAgent) {
                draft.aiAgentList?.unshift({
                  ...targetAgent,
                  aiAgentID: templateID,
                })
              }
            },
          ),
        )
        try {
          const { data: agentDetail } = await queryFulfilled
          patchResult.undo()
          dispatch(
            agentAuthAPI.util.updateQueryData(
              "getAIAgentListByPage",
              { teamID },
              (draft) => {
                draft.aiAgentList?.unshift(agentDetail)
              },
            ),
          )
        } catch {
          patchResult.undo()
        }
      },
    }),
    forkAIAgentToTeam: builder.mutation<
      Agent,
      { teamID: string; aiAgentID: string }
    >({
      query: ({ aiAgentID, teamID }) => ({
        url: `/aiAgent/${aiAgentID}/forkTo/teams/${teamID}`,
        method: "POST",
      }),
    }),
    putAgentDetail: builder.mutation<
      Agent,
      { teamID: string; aiAgentID: string; agentRaw: AgentRaw }
    >({
      query: ({ teamID, aiAgentID, agentRaw }) => ({
        url: `/teams/${teamID}/aiAgent/${aiAgentID}`,
        method: "PUT",
        body: agentRaw,
      }),
    }),
    createAgent: builder.mutation<
      Agent,
      { teamID: string; agentRaw: AgentRaw }
    >({
      query: ({ teamID, agentRaw }) => {
        return {
          url: `/teams/${teamID}/aiAgent`,
          method: "POST",
          body: agentRaw,
        }
      },
      onQueryStarted: async ({ teamID }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(
            agentAuthAPI.util.updateQueryData(
              "getAIAgentListByPage",
              {
                teamID,
              },
              (draft) => {
                draft.aiAgentList?.push(data)
              },
            ),
          )
          dispatch(
            agentAuthAPI.util.upsertQueryData(
              "getAgentDetail",
              { teamID, aiAgentID: data.aiAgentID },
              data,
            ),
          )
        } catch {}
      },
    }),
    generatePromptDescription: builder.mutation<
      { payload: string },
      { teamID: string; prompt: string }
    >({
      query: ({ teamID, prompt }) => ({
        url: `/teams/${teamID}/aiAgent/generatePromptDescription`,
        method: "POST",
        timeout: 600000,
        body: { prompt: encodeURIComponent(prompt) },
      }),
    }),
    generateIcon: builder.mutation<
      { payload: string },
      { teamID: string; name: string; description: string }
    >({
      query: ({ teamID, name, description }) => ({
        url: `/teams/${teamID}/aiAgent/generateAvatar`,
        method: "POST",
        body: {
          name: encodeURIComponent(name),
          description: encodeURIComponent(description),
        },
        timeout: 600000,
      }),
    }),
    getAgentIconUploadAddress: builder.mutation<
      { uploadAddress: string },
      { teamID: string; base64: string }
    >({
      query: ({ teamID, base64 }) => {
        const fileName = v4()
        const type = getFileExtensionFromBase64(base64)
        return {
          url: `/teams/${teamID}/aiAgent/icon/uploadAddress/fileName/${fileName}.${type}`,
          method: "GET",
        }
      },
    }),
    getAIAgentListByPage: builder.query<
      {
        aiAgentList: Agent[]
        hasMore: boolean
      },
      {
        teamID: string
        keywords?: string
      }
    >({
      query: ({ teamID, keywords }) => {
        return keywords
          ? `/teams/${teamID}/aiAgent/list/sortBy/updatedAt/like/keywords/${keywords}`
          : `/teams/${teamID}/aiAgent/list/sortBy/updatedAt`
      },
      providesTags: (result, error, { teamID }) =>
        result?.aiAgentList
          ? [
              ...result?.aiAgentList.map(({ aiAgentID }) => ({
                type: "Agents" as const,
                id: aiAgentID,
              })),
              { type: "Agents", id: `${teamID}-LIST-PAGE` },
            ]
          : [{ type: "Agents", id: `${teamID}-LIST-PAGE` }],
    }),
    deleteAIAgent: builder.mutation<
      {
        aiAgentID: string
      },
      { teamID: string; aiAgentID: string }
    >({
      query: ({ teamID, aiAgentID }) => ({
        url: `/teams/${teamID}/aiAgent/${aiAgentID}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { teamID, aiAgentID },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          agentAuthAPI.util.updateQueryData(
            "getAIAgentListByPage",
            {
              teamID,
            },
            (draft) => {
              draft.aiAgentList = draft.aiAgentList?.filter(
                (agent) => agent.aiAgentID !== aiAgentID,
              )
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
  }),
})

export const {
  useGetAgentDetailQuery,
  useLazyGetAgentDetailQuery,
  useGetAgentContributeStateQuery,
  useGetContributedAgentDetailQuery,
  useLazyGetAIAgentAnonymousAddressQuery,
  useLazyGetAIAgentWsAddressQuery,
  useForkAIAgentToTeamMutation,
  usePutAgentDetailMutation,
  useCreateAgentMutation,
  useGeneratePromptDescriptionMutation,
  useGenerateIconMutation,
  useGetAgentIconUploadAddressMutation,
  useGetAIAgentListByPageQuery,
  useDuplicateAIAgentMutation,
  useDeleteAIAgentMutation,
} = agentAuthAPI
