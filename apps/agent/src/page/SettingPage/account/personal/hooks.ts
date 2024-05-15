import {
  useGetUserInfoQuery,
  useUploadUserAvatarMutation,
} from "@illa-public/user-data"
import { getAvatarURL } from "@/utils/supabaseStorage"

export const useUploadAvatar = () => {
  const { data } = useGetUserInfoQuery(null)

  const [handleUploadUserAvatar] = useUploadUserAvatarMutation()

  const uploadUserAvatar = (file: File) => {
    if (!data) return
    return new Promise<string>(async (resolve, reject) => {
      try {
        const path = await handleUploadUserAvatar({
          file,
          userID: data.id,
        }).unwrap()
        resolve(getAvatarURL(path))
      } catch (e) {
        reject(e)
      }
    })
  }

  return uploadUserAvatar
}
