import { TipisTrack } from "@illa-public/track-utils"
import { teamAPI, userAPI } from "@illa-public/user-data"
import { getAuthToken } from "@illa-public/utils"
import store from "@/redux/store"
import { findRecentTeamInfo } from "../../utils/team"

export const getUserInfoLoader = async () => {
  const token = getAuthToken()
  if (!token) {
    TipisTrack.reset()
    return false
  } else {
    try {
      const promise = store.dispatch(
        userAPI.endpoints.getUserInfo.initiate(null),
      )
      const currentUserInfo = await promise.unwrap()
      TipisTrack.identify(currentUserInfo.id, {
        nickname: currentUserInfo.nickname,
        email: currentUserInfo.email,
        language: currentUserInfo.language,
      })

      return true
    } catch {
      TipisTrack.reset()
      return false
    }
  }
}

export const getRecentTeamsInfoLoader = async () => {
  const token = getAuthToken()
  if (!token) {
    TipisTrack.reset()
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
