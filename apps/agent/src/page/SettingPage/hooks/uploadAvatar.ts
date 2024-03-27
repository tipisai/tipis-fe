import { useSelector } from "react-redux"
import { v4 } from "uuid"
import {
  getCurrentId,
  useLazyGetTeamIconUploadAddressQuery,
  useLazyGetUserAvatarUploadAddressQuery,
} from "@illa-public/user-data"
import { uploadAvatar } from "@/services/user"

export const useUploadAvatar = () => {
  const [triggerGetUserAvatarUploadAddress] =
    useLazyGetUserAvatarUploadAddressQuery()

  const [triggerGetTeamIconUploadAddress] =
    useLazyGetTeamIconUploadAddressQuery()

  const currentTeamID = useSelector(getCurrentId)!

  const uploadUserAvatar = (file: Blob) => {
    const fileName = v4()
    return new Promise<string>(async (resolve, reject) => {
      try {
        const type = file.type.split("/")[1]
        const { data } = await triggerGetUserAvatarUploadAddress({
          fileName,
          type,
        })
        if (data?.uploadAddress) {
          const imgUrl = await uploadAvatar(data?.uploadAddress, file)
          resolve(imgUrl)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  const uploadTeamIcon = (file: Blob) => {
    const fileName = v4()
    return new Promise<string>(async (resolve, reject) => {
      try {
        const type = file.type.split("/")[1]
        const { data } = await triggerGetTeamIconUploadAddress({
          teamID: currentTeamID,
          type,
          fileName,
        })
        if (data?.uploadAddress) {
          const imgUrl = await uploadAvatar(data?.uploadAddress, file)
          resolve(imgUrl)
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  return {
    uploadUserAvatar,
    uploadTeamIcon,
  }
}
