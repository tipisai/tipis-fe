import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  HTTP_REQUEST_PUBLIC_BASE_URL,
  OBJECT_STORAGE_REQUEST_PREFIX,
} from "@illa-public/illa-net"
import { UPLOAD_FILE_STATUS } from "@illa-public/public-types"
import { getAuthToken } from "@illa-public/utils"

const FOLDER_ID = "ILAfx4p1C7dZ"

export const driveAPI = createApi({
  reducerPath: "driveAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${OBJECT_STORAGE_REQUEST_PREFIX}`,
    prepareHeaders: (headers) => {
      const token = getAuthToken()
      if (token) {
        headers.set("Authorization", token)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getChatUploadAddress: builder.query<
      {
        uploadAddress: string
        fileID: string
      },
      {
        name: string
        contentType: string
        teamID: string
        size: number
      }
    >({
      query: ({ contentType, name, teamID, size }) => {
        return {
          url: `/teams/${teamID}/temporaryFiles`,
          method: "POST",
          body: {
            name,
            folderID: FOLDER_ID,
            type: "file",
            contentType,
            size,
          },
        }
      },
    }),

    getKnowledgeUploadAddress: builder.query<
      {
        uploadAddress: string
        fileID: string
      },
      {
        name: string
        contentType: string
        teamID: string
        size: number
      }
    >({
      query: ({ contentType, name, teamID, size }) => {
        return {
          url: `/teams/${teamID}/files`,
          method: "POST",
          body: {
            name,
            folderID: FOLDER_ID,
            type: "file",
            contentType,
            size,
          },
        }
      },
    }),

    putChatFileUploadStatus: builder.mutation<
      {},
      {
        fileID: string
        status: UPLOAD_FILE_STATUS
        teamID: string
      }
    >({
      query: ({ fileID, status, teamID }) => ({
        url: `/teams/${teamID}/temporaryFiles/${fileID}`,
        method: "PUT",
        body: {
          status,
        },
      }),
    }),

    putKnowledgeFileUploadStatus: builder.mutation<
      {},
      {
        fileID: string
        status: UPLOAD_FILE_STATUS
        teamID: string
      }
    >({
      query: ({ fileID, status, teamID }) => ({
        url: `/teams/${teamID}/files/${fileID}`,
        method: "PUT",
        body: {
          status,
        },
      }),
    }),

    deleteKnowledgeFile: builder.mutation<
      undefined,
      {
        fileID: string
        teamID: string
      }
    >({
      query: ({ fileID, teamID }) => ({
        url: `/teams/${teamID}/files/${fileID}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useLazyGetChatUploadAddressQuery,
  useLazyGetKnowledgeUploadAddressQuery,
  usePutChatFileUploadStatusMutation,
  usePutKnowledgeFileUploadStatusMutation,
  useDeleteKnowledgeFileMutation,
} = driveAPI
