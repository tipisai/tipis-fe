import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import { teamAPI, userAPI } from "@illa-public/user-data"
import { getAuthToken, sendConfigEvent } from "@illa-public/utils"
import store from "@/redux/store"
import { findRecentTeamInfo } from "../../utils/team"

export const getUserInfoLoader = async () => {
  const token = getAuthToken()
  if (!token) {
    ILLAMixpanel.reset()
    return false
  } else {
    try {
      const promise = store.dispatch(
        userAPI.endpoints.getUserInfo.initiate(null),
      )
      const currentUserInfo = await promise.unwrap()
      sendConfigEvent(currentUserInfo.userID)
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

export const getRecentTeamsInfoLoader = async () => {
  const token = getAuthToken()
  if (!token) {
    ILLAMixpanel.reset()
    return undefined
  } else {
    try {
      const promise = store.dispatch(
        teamAPI.endpoints.getTeamsInfo.initiate(null),
      )
      const teamInfos = await promise.unwrap()
      const recentTeamInfo = findRecentTeamInfo(teamInfos)
      if (recentTeamInfo) {
        return recentTeamInfo
      }
      return undefined
    } catch {
      return undefined
    }
  }
}
