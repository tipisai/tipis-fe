import { TipisTrack } from "@illa-public/track-utils"
import { useSignOutMutation } from "@illa-public/user-data"
import { getILLACloudURL, removeAuthToken } from "@illa-public/utils"
import { AUTH_PAGE_PATH } from "@/router/constants"
import { TIPISStorage } from "@/utils/storage"

export const useSignOut = () => {
  const [signOutHandler] = useSignOutMutation()
  const signOut = async () => {
    TipisTrack.track("click_logout")
    TipisTrack.reset()
    removeAuthToken()
    TIPISStorage.clearLocalStorage()
    try {
      await signOutHandler(null)
    } catch (e) {
    } finally {
      window.location.href = `${getILLACloudURL(window.customDomain)}${AUTH_PAGE_PATH}`
    }
  }
  return signOut
}
