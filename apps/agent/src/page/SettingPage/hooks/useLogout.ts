import { TipisTrack } from "@illa-public/track-utils"
import { useLogoutMutation } from "@illa-public/user-data"
import {
  getAuthToken,
  getILLACloudURL,
  removeAuthToken,
} from "@illa-public/utils"
import { AUTH_PAGE_PATH } from "@/router/constants"
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
      window.location.href = `${getILLACloudURL(window.customDomain)}${AUTH_PAGE_PATH}`
      return
    }
    try {
      await logoutMutation(ILLAToken)
    } catch (e) {
    } finally {
      window.location.href = `${getILLACloudURL(window.customDomain)}${AUTH_PAGE_PATH}`
    }
  }
  return logout
}
