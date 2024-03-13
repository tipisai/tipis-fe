import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import {
  CurrentUserInitialState,
  currentUserActions,
  teamActions,
  useLogoutMutation,
} from "@illa-public/user-data"
import { getAuthToken, getILLACloudURL } from "@illa-public/utils"
import store from "@/redux/store"
import { TIPISStorage } from "@/utils/storage"

export const useLogout = () => {
  const [logoutMutation] = useLogoutMutation()
  const logout = async () => {
    ILLAMixpanel.reset()
    const ILLAToken = getAuthToken()
    TIPISStorage.clearLocalStorage()
    store.dispatch(
      currentUserActions.updateCurrentUserReducer(CurrentUserInitialState),
    )
    store.dispatch(teamActions.updateTeamReducer({}))
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
