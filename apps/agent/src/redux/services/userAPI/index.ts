import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { v4 } from "uuid"
import {
  CLOUD_REQUEST_PREFIX,
  HTTP_REQUEST_PUBLIC_BASE_URL,
} from "@illa-public/illa-net"
import { getAuthToken } from "@illa-public/utils"

export const userAPI = createApi({
  reducerPath: "userAPI",
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
    updateUserLanguage: builder.mutation<undefined, string>({
      query: (language) => ({
        url: "/users/language",
        method: "PATCH",
        body: {
          language,
        },
      }),
    }),

    cancelLinked: builder.mutation<undefined, "github" | "google">({
      query: (oauthAgency) => ({
        url: `/users/oauth/${oauthAgency}`,
        method: "DELETE",
      }),
    }),

    updateUserPassword: builder.mutation<
      undefined,
      {
        currentPassword: string
        newPassword: string
      }
    >({
      query: (data) => ({
        url: "/users/password",
        method: "PATCH",
        data,
      }),
    }),

    updateNickName: builder.mutation<undefined, string>({
      query: (nickname) => ({
        url: "/users/nickname",
        method: "PATCH",
        body: {
          nickname,
        },
      }),
    }),

    updateUserAvatar: builder.mutation<undefined, string>({
      query: (avatar) => ({
        url: "/users/avatar",
        method: "PATCH",
        body: {
          avatar,
        },
      }),
    }),

    getUserAvatarUploadAddress: builder.query<
      {
        uploadAddress: string
      },
      string
    >({
      query: (type) => {
        const fileName = v4()
        return {
          url: `/users/avatar/uploadAddress/fileName/${fileName}.${type}`,
          method: "GET",
        }
      },
    }),

    // ---
  }),
})

// export const {
//   useUpdateUserLanguageMutation,
//   useCancelLinkedMutation,
//   useUpdateUserPasswordMutation,
//   useUpdateNickNameMutation,
//   useLazyGetUserAvatarUploadAddressQuery,
//   useUpdateUserAvatarMutation,
// } = userAPI
