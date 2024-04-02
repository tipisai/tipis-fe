import { TipisTrack } from "@illa-public/track-utils"
import { useLogoutMutation } from "@illa-public/user-data"
import {
  getAuthToken,
  getILLACloudURL,
  removeAuthToken,
} from "@illa-public/utils"
import { TIPISStorage } from "@/utils/storage"

export const useLogout = () => {
  const [logoutMutation] = useLogoutMutation()
  const logout = async () => {
    TipisTrack.track("click_logout")
    TipisTrack.reset()
    const ILLAToken = getAuthToken()
    removeAuthToken()
    TIPISStorage.clearLocalStorage()
    if (!ILLAToken) {
      window.location.href = `${getILLACloudURL(window.customDomain)}/user/login`
      return
    }
    try {
      await logoutMutation(ILLAToken)
    } catch (e) {
    } finally {
      window.location.href = `${getILLACloudURL(window.customDomain)}/user/login`
    }
  }
  return logout
}
