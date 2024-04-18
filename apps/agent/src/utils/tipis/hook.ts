import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getCurrentId } from "@illa-public/user-data"
import {
  useGetAgentContributeStateQuery,
  useGetAgentDetailQuery,
} from "@/redux/services/agentAPI"

export const useGetTipiContributed = () => {
  const { agentID, teamIdentifier } = useParams()

  const { data, isLoading, isError } = useGetAgentContributeStateQuery({
    aiAgentID: agentID!,
    ownerTeamIdentifier: teamIdentifier!,
  })

  const returnValue = useMemo(
    () => ({
      data,
      isLoading,
      isError,
      agentID,
    }),
    [agentID, data, isError, isLoading],
  )

  return returnValue
}

export const useGetNotContributeTipDetail = () => {
  const currentTeamID = useSelector(getCurrentId)
  const { agentID } = useParams()

  const { data, isLoading, isError, isSuccess } = useGetAgentDetailQuery({
    aiAgentID: agentID!,
    teamID: currentTeamID!,
  })

  const returnValue = useMemo(
    () => ({
      data,
      isLoading,
      isError,
      isSuccess,
    }),
    [data, isError, isLoading, isSuccess],
  )

  return returnValue
}
