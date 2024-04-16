import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import {
  HTTP_REQUEST_PUBLIC_BASE_URL,
  OBJECT_STORAGE_REQUEST_PREFIX,
} from "@illa-public/illa-net"
import { GCS_OBJECT_TYPE, UPLOAD_FILE_STATUS } from "@illa-public/public-types"
import { prepareHeaders } from "@illa-public/user-data"

const FOLDER_ID = "ILAfx4p1C7dZ"

export const driveAPI = createApi({
  reducerPath: "driveAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${OBJECT_STORAGE_REQUEST_PREFIX}`,
    prepareHeaders: prepareHeaders,
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
            type: GCS_OBJECT_TYPE.FILE,
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
            type: GCS_OBJECT_TYPE.FILE,
            contentType,
            size,
          },
        }
      },
    }),

    putChatFileUploadStatus: builder.mutation<
      {
        id: string
        downloadURL: string
      },
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
      {
        id: string
        downloadURL: string
      },
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
