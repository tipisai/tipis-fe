import { builderRequest } from "@illa-public/illa-net"
import { ActionContent } from "@illa-public/public-types"
import { ActionItem } from "@illa-public/public-types"

export const createAction = async (
  appId: string,
  teamID: string,
  data: Partial<ActionItem<ActionContent>>,
) => {
  const response = await builderRequest<ActionItem<ActionContent>>(
    {
      url: `/apps/${appId}/actions`,
      method: "POST",
      data,
    },
    { teamID: teamID },
  )
  return response.data.actionID
}
