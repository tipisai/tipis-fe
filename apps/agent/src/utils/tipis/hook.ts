import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getCurrentId } from "@illa-public/user-data"
import {
  useGetAgentContributeStateQuery,
  useGetAgentDetailQuery,
  useGetContributedAgentDetailQuery,
} from "@/redux/services/agentAPI"
import { useGetAIAgentMarketplaceInfoQuery } from "@/redux/services/marketAPI"

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

export const useGetTipiContributedDetail = () => {
  const { agentID, teamIdentifier } = useParams()

  const {
    data: contributeAgentDetail,
    isLoading: isGetContributedAgentDetailLoading,
    isError: isGetContributedAgentDetailError,
  } = useGetContributedAgentDetailQuery({
    aiAgentID: agentID!,
    ownerTeamIdentifier: teamIdentifier!,
  })

  const {
    data: aiAgentMarketPlaceInfo,
    isLoading: isGetAIAgentMarketplaceInfoLoading,
    isError: isGetAIAgentMarketplaceInfoError,
  } = useGetAIAgentMarketplaceInfoQuery({
    aiAgentID: agentID!,
  })

  const mixedIsLoading =
    isGetContributedAgentDetailLoading || isGetAIAgentMarketplaceInfoLoading
  const mixedIsError =
    isGetContributedAgentDetailError || isGetAIAgentMarketplaceInfoError

  const returnValue = useMemo(
    () => ({
      contributeAgentDetail,
      aiAgentMarketPlaceInfo,
      isLoading: mixedIsLoading,
      isError: mixedIsError,
    }),
    [
      aiAgentMarketPlaceInfo,
      contributeAgentDetail,
      mixedIsError,
      mixedIsLoading,
    ],
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
