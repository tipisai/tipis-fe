import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { stringify } from "qs"
import {
  DRIVE_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { UPLOAD_FILE_STATUS } from "@illa-public/public-types"
import { getAuthToken } from "@illa-public/utils"
import {
  IGetFileListRequestData,
  IGetFileListResponseData,
  IGetUploadFileURLRequest,
  IGetUploadFileURLResponse,
} from "./interface"

export const driveAPI = createApi({
  reducerPath: "driveAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${HTTP_REQUEST_PUBLIC_BASE_URL}${DRIVE_REQUEST_PREFIX}`,
    prepareHeaders: (headers) => {
      const token = getAuthToken()
      if (token) {
        headers.set("Authorization", token)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getFileList: builder.query<
      IGetFileListResponseData,
      {
        req: IGetFileListRequestData
        teamID: string
      }
    >({
      query: ({ req, teamID }) => {
        const qs = stringify(req)
        return {
          url: `/teams/${teamID}/files?${qs}`,
          method: "GET",
        }
      },
    }),

    getUploadURL: builder.query<
      IGetUploadFileURLResponse,
      {
        req: IGetUploadFileURLRequest
        teamID: string
      }
    >({
      query: ({ req, teamID }) => ({
        url: `/teams/${teamID}/files`,
        method: "POST",
        body: {
          ...req,
          resumable: true,
        },
      }),
    }),

    putUploadStatus: builder.mutation<
      IGetUploadFileURLResponse,
      {
        fileID: string
        status: UPLOAD_FILE_STATUS
        teamID: string
      }
    >({
      query: ({ fileID, status, teamID }) => ({
        url: `/teams/${teamID}/files/${fileID}/status`,
        method: "PUT",
        body: {
          status,
        },
      }),
    }),

    deleteFile: builder.mutation<
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

    // ---
  }),
})

export const {
  useLazyGetFileListQuery,
  useLazyGetUploadURLQuery,
  usePutUploadStatusMutation,
  useDeleteFileMutation,
} = driveAPI
