import { FC } from "react"
import { Navigate } from "react-router-dom"
import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
import { useGetUserInfoAndTeamsInfoByTokenQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import { BaseProtectComponentProps } from "@/router/interface"

const EmptyTeamProtectedComponent: FC<BaseProtectComponentProps> = (props) => {
  const { isSuccess, error, data } = useGetUserInfoAndTeamsInfoByTokenQuery({})

  if (error && "status" in error) {
    if (error.status === 401) {
      ILLAMixpanel.reset()
      window.location.href = `${getILLACloudURL(window.customDomain)}/user/login?redirectURL=${encodeURIComponent(
        window.location.href,
      )}`
      return null
    }
    return <Navigate to="/404" />
  }

  if (Array.isArray(data?.teams) && data.teams.length > 0) {
    return <Navigate to="/workspace" />
  }

  return isSuccess ? (
    <>
      {props.children}
      <UpgradeModalGroup />
    </>
  ) : null
}

export default EmptyTeamProtectedComponent
