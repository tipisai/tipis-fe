import { builderRequest } from "@illa-public/illa-net"
import { AppInfoShape, ComponentTreeNode } from "@illa-public/public-types"

interface IAppCreateRequestData {
  appName: string
  initScheme: ComponentTreeNode
}

export const fetchCreateApp = (teamID: string, data: IAppCreateRequestData) => {
  return builderRequest<AppInfoShape>(
    {
      url: "/apps",
      method: "POST",
      data,
    },
    { teamID },
  )
}
