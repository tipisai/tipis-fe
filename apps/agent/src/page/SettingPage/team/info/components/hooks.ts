import { useUploadTeamAvatarMutation } from "@illa-public/user-data"
import { getAvatarURL } from "@/utils/supabaseStorage"
import { useGetCurrentTeamInfo } from "@/utils/team"

export const useUploadTeamIcon = () => {
  const teamInfo = useGetCurrentTeamInfo()
  const [handleUploadTeamAvatar] = useUploadTeamAvatarMutation()

  const uploadTeamIcon = (file: File) => {
    if (!teamInfo) return
    return new Promise<string>(async (resolve, reject) => {
      try {
        const path = await handleUploadTeamAvatar({
          file,
          teamID: teamInfo.id,
        }).unwrap()
        resolve(getAvatarURL(path))
      } catch (e) {
        reject(e)
      }
    })
  }

  return uploadTeamIcon
}
