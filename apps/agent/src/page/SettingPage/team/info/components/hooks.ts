import { v4 } from "uuid"
import { useLazyGetTeamIconUploadAddressQuery } from "@illa-public/user-data"
import { uploadAvatar } from "@/services/user"
import { useGetCurrentTeamInfo } from "@/utils/team"

export const useUploadTeamIcon = () => {
  const [triggerGetTeamIconUploadAddress] =
    useLazyGetTeamIconUploadAddressQuery()

  const teamInfo = useGetCurrentTeamInfo()!

  const uploadTeamIcon = (file: File) => {
    const fileName = v4()
    return new Promise<string>(async (resolve, reject) => {
      try {
        const type = file.type.split("/")[1]
        const { data } = await triggerGetTeamIconUploadAddress({
          teamID: teamInfo.id,
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

  return uploadTeamIcon
}
