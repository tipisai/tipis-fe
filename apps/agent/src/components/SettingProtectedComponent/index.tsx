import { FC } from "react"
import { Navigate } from "react-router-dom"
import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
import { useGetUserInfoAndTeamsInfoByTokenQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import { SettingProtectedAuthProps } from "./interface"

const SettingProtectedComponent: FC<SettingProtectedAuthProps> = (props) => {
  const { isSuccess, error } = useGetUserInfoAndTeamsInfoByTokenQuery({})

  if (error && "status" in error) {
    if (error.status === 401) {
      window.location.href = `${getILLACloudURL(window.customDomain)}/login?redirectURL=${encodeURIComponent(
        window.location.href,
      )}`
      return null
    }
    return <Navigate to="/404" />
  }

  return isSuccess ? (
    <>
      {props.children}
      <UpgradeModalGroup />
    </>
  ) : null
}

export default SettingProtectedComponent
