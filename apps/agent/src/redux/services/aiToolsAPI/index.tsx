import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { v4 } from "uuid"
import {
  AGENT_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { IBaseFunction, TActionOperation } from "@illa-public/public-types"
import { prepareHeaders } from "@illa-public/user-data"
import { getFileExtensionFromBase64 } from "../../../utils/file"
import {
  IAIToolDTO,
  IAIToolParametersDTO,
  IGetAllAIToolsListResponseDTO,
} from "./interface"

export const aiToolsAPI = createApi({
  reducerPath: "aiToolsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${AGENT_REQUEST_PREFIX}`,
    prepareHeaders,
  }),
  endpoints: (builder) => ({
    getAllAIToolsList: builder.query<IGetAllAIToolsListResponseDTO, string>({
      query: (teamID) => ({
        url: `/teams/${teamID}/aiTool/list/sortBy/updateAt`,
      }),
    }),
    createAITool: builder.mutation<
      IAIToolDTO<unknown>,
      {
        teamID: string
        aiTool: IBaseFunction
      }
    >({
      query: ({ teamID, aiTool }) => ({
        url: `/teams/${teamID}/aiTool`,
        method: "POST",
        body: aiTool,
      }),
      onQueryStarted: async ({ teamID }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(
            aiToolsAPI.util.updateQueryData(
              "getAllAIToolsList",
              teamID,
              (draft) => {
                const aiToolList = draft.aiToolList || []
                aiToolList.unshift(data)
                draft.aiToolList = aiToolList
              },
            ),
          )
        } catch {}
      },
    }),
    updateAIToolByID: builder.mutation<
      IAIToolDTO<unknown>,
      {
        teamID: string
        aiToolID: string
        aiTool: IBaseFunction
      }
    >({
      query: ({ teamID, aiTool, aiToolID }) => ({
        url: `/teams/${teamID}/aiTool/${aiToolID}`,
        method: "PUT",
        body: aiTool,
      }),
      onQueryStarted: async (
        { teamID, aiTool, aiToolID },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          aiToolsAPI.util.updateQueryData(
            "getAllAIToolsList",
            teamID,
            (draft) => {
              const aiToolList = draft.aiToolList || []
              const targetAITool = aiToolList.find(
                (item) => item.aiToolID === aiToolID,
              )
              if (targetAITool) {
                Object.assign(targetAITool, aiTool)
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
    deleteAIToolByID: builder.mutation<
      void,
      { teamID: string; aiToolID: string }
    >({
      query: ({ teamID, aiToolID }) => ({
        url: `/teams/${teamID}/aiTool/${aiToolID}`,
        method: "DELETE",
      }),
      onQueryStarted: async (
        { teamID, aiToolID },
        { dispatch, queryFulfilled },
      ) => {
        const patchResult = dispatch(
          aiToolsAPI.util.updateQueryData(
            "getAllAIToolsList",
            teamID,
            (draft) => {
              const aiToolList = draft.aiToolList || []
              const targetAIToolIndex = aiToolList.findIndex(
                (item) => item.aiToolID === aiToolID,
              )
              if (targetAIToolIndex !== -1) {
                aiToolList.splice(targetAIToolIndex, 1)
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
      onQueryStarted: async ({ teamID }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(
            aiToolsAPI.util.updateQueryData(
              "getAllAIToolsList",
              teamID,
              (draft) => {
                const aiToolList = draft.aiToolList || []
                aiToolList.unshift(data)
                draft.aiToolList = aiToolList
              },
            ),
          )
        } catch {}
      },
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

    testRunAITools: builder.mutation<
      {
        data: unknown
      },
      {
        teamID: string
        testData: {
          resourceID: string
          resourceType: string
          actionOperation: TActionOperation
          parameters: IAIToolParametersDTO[]
          content: unknown
          context: Record<string, unknown>
        }
      }
    >({
      query: ({ teamID, testData }) => ({
        url: `/teams/${teamID}/aiTool/testRun`,
        method: "POST",
        body: {
          ...testData,
          context: testData.context || {},
        },
      }),
    }),
    getAIToolDetail: builder.query<
      IAIToolDTO<unknown>,
      {
        teamID: string
        aiToolID: string
      }
    >({
      query: ({ teamID, aiToolID }) => ({
        url: `/teams/${teamID}/aiTool/${aiToolID}`,
      }),
    }),
  }),
})

export const {
  useGetAllAIToolsListQuery,
  useCreateAIToolMutation,
  useDeleteAIToolByIDMutation,
  useDuplicateAIToolByIDMutation,
  useGetAIToolIconUploadAddressMutation,
  useUpdateAIToolByIDMutation,
  useTestRunAIToolsMutation,
  useGetAIToolDetailQuery,
  useLazyGetAIToolDetailQuery,
} = aiToolsAPI
