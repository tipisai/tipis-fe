import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import { authAPI } from "@illa-public/user-data"
import { getAuthToken, sendConfigEvent } from "@illa-public/utils"
import store from "@/redux/store"

export const getUserInfoLoader = async () => {
  const { data: userInfo } = authAPI.endpoints.getUserInfo.select()(
    store.getState(),
  )
  if (!userInfo) {
    const token = getAuthToken()
    if (!token) {
      ILLAMixpanel.reset()
      return false
    } else {
      try {
        const promise = store.dispatch(authAPI.endpoints.getUserInfo.initiate())
        const currentUserInfo = await promise.unwrap()
        sendConfigEvent(currentUserInfo?.userID)
        ILLAMixpanel.setUserID(currentUserInfo.userID)
        const reportedUserInfo: Record<string, any> = {}
        Object.entries(currentUserInfo).forEach(([key, value]) => {
          reportedUserInfo[`illa_${key}`] = value
        })
        ILLAMixpanel.setUserProperties(reportedUserInfo)

        return true
      } catch {
        ILLAMixpanel.reset()
        return false
      }
    }
  }
  return true
}
