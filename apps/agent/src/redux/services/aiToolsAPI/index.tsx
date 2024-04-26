import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { v4 } from "uuid"
import {
  AGENT_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { prepareHeaders } from "@illa-public/user-data"
import { getFileExtensionFromBase64 } from "../../../utils/file"
import {
  IAIToolDTO,
  ICreateOrUpdateAIToolRequestDTO,
  IGetAllAIToolsListResponseDTO,
} from "./interface"

export const aiToolsAPI = createApi({
  reducerPath: "aiToolsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${AGENT_REQUEST_PREFIX}`,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getAllAIToolsList: builder.query<
      IGetAllAIToolsListResponseDTO,
      {
        teamID: string
        sortBy: "id" | "createdAt" | "updateAt"
      }
    >({
      query: ({ teamID, sortBy = "updateAt" }) => ({
        url: `/teams/${teamID}/aiTool/list/sortBy/${sortBy}`,
      }),
    }),
    createAITool: builder.mutation<
      IAIToolDTO<unknown>,
      {
        teamID: string
        aiTool: ICreateOrUpdateAIToolRequestDTO<unknown>
      }
    >({
      query: ({ teamID, aiTool }) => ({
        url: `/teams/${teamID}/aiTool`,
        method: "POST",
        body: aiTool,
      }),
    }),
    updateAiToolByID: builder.mutation<
      IAIToolDTO<unknown>,
      {
        teamID: string
        aiToolID: string
        aiTool: ICreateOrUpdateAIToolRequestDTO<unknown>
      }
    >({
      query: ({ teamID, aiTool, aiToolID }) => ({
        url: `/teams/${teamID}/aiTool/${aiToolID}`,
        method: "PUT",
        body: aiTool,
      }),
    }),
    deleteAIToolByID: builder.mutation<
      void,
      { teamID: string; aiToolID: string }
    >({
      query: ({ teamID, aiToolID }) => ({
        url: `/teams/${teamID}/aiTool/${aiToolID}`,
        method: "DELETE",
      }),
    }),
    duplicateAIToolByID: builder.mutation<
      IAIToolDTO<unknown>,
      {
        teamID: string
        aiToolID: string
      }
    >({
      query: ({ teamID, aiToolID }) => ({
        url: `/teams/${teamID}/aiTool/${aiToolID}/duplicate`,
        method: "POST",
      }),
    }),
    getAIToolIconUploadAddress: builder.mutation<
      { uploadAddress: string },
      { teamID: string; base64: string }
    >({
      query: ({ teamID, base64 }) => {
        const fileName = v4()
        const type = getFileExtensionFromBase64(base64)
        return {
          url: `/teams/${teamID}/aiTool/icon/uploadAddress/fileName/${fileName}.${type}`,
          method: "GET",
        }
      },
    }),
  }),
})

export const { useGetAllAIToolsListQuery } = aiToolsAPI
