import {
  ILLAMixpanel,
  ILLAProperties,
  ILLA_MIXPANEL_EVENT_TYPE,
  ILLA_PAGE_NAME,
} from "@illa-public/mixpanel-utils"
import { getCurrentTeamInfo, getCurrentUserID } from "@illa-public/user-data"
import { useCallback } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import store from "@/redux/store"

export const useTrack = () => {
  const { teamIdentifier } = useParams()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)
  const userID = useSelector(getCurrentUserID)

  const track = useCallback(
    (
      event: ILLA_MIXPANEL_EVENT_TYPE,
      pageName: ILLA_PAGE_NAME,
      properties: Omit<ILLAProperties, "page"> = {},
    ) => {
      ILLAMixpanel.track(event, {
        ...properties,
        team_id: teamIdentifier ?? "-1",
        parameter11: currentTeamInfo?.myRole ?? "no_team",
        page: pageName,
        user_id: userID,
      })
    },
    [currentTeamInfo?.myRole, teamIdentifier, userID],
  )

  return track
}

export const track = (
  event: ILLA_MIXPANEL_EVENT_TYPE,
  pageName: ILLA_PAGE_NAME,
  properties: Omit<ILLAProperties, "page"> = {},
) => {
  const currentTeamInfo = getCurrentTeamInfo(store.getState())
  const userID = getCurrentUserID(store.getState())
  const teamIdentifier = currentTeamInfo?.identifier
  ILLAMixpanel.track(event, {
    ...properties,
    team_id: teamIdentifier ?? "-1",
    parameter11: currentTeamInfo?.myRole ?? "no_team",
    page: pageName,
    user_id: userID,
  })
}
