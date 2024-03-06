import {
  AGENT_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { Agent, AgentRaw } from "@illa-public/public-types"
import { getAuthToken } from "@illa-public/utils"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { v4 } from "uuid"
import { getFileExtensionFromBase64 } from "@/utils/file"

export const agentAuthAPI = createApi({
  reducerPath: "agentAuthAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${AGENT_REQUEST_PREFIX}`,
    prepareHeaders: (headers) => {
      const token = getAuthToken()
      if (token) {
        headers.set("Authorization", token)
      }
      return headers
    },
  }),
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
        data: agentRaw,
      }),
    }),
    createAgent: builder.mutation<
      Agent,
      { teamID: string; agentRaw: AgentRaw }
    >({
      query: ({ teamID, agentRaw }) => ({
        url: `/teams/${teamID}/aiAgent`,
        method: "POST",
        data: agentRaw,
      }),
    }),
    generatePromptDescription: builder.mutation<
      { payload: string },
      { teamID: string; prompt: string }
    >({
      query: ({ teamID, prompt }) => ({
        url: `/teams/${teamID}/aiAgent/generatePromptDescription`,
        method: "POST",
        timeout: 600000,
        data: { prompt: encodeURIComponent(prompt) },
      }),
    }),
    generateIcon: builder.mutation<
      { payload: string },
      { teamID: string; name: string; description: string }
    >({
      query: ({ teamID, name, description }) => ({
        url: `/teams/${teamID}/aiAgent/generateIcon`,
        method: "POST",
        data: {
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
          url: `teams/${teamID}/aiAgent/icon/uploadAddress/fileName/${fileName}.${type}`,
          method: "POST",
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
} = agentAuthAPI
