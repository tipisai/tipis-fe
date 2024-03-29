import { FC } from "react"
import { Navigate } from "react-router-dom"
import { ILLAMixpanel } from "@illa-public/mixpanel-utils"
import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { getILLACloudURL } from "@illa-public/utils"
import i18n from "@/i18n"
import { BaseProtectComponentProps } from "@/router/interface"

const LoginAuth: FC<BaseProtectComponentProps> = (props) => {
  const { data, isSuccess, error } = useGetUserInfoQuery(null, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

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

  if (data) {
    const currentLng = i18n.language
    ILLAMixpanel.setUserID(data.userID)
    const reportedUserInfo: Record<string, any> = {}
    Object.entries(data).forEach(([key, value]) => {
      reportedUserInfo[`illa_${key}`] = value
    })
    ILLAMixpanel.setUserProperties(reportedUserInfo)
    if (data.language && data.language !== currentLng) {
      i18n.changeLanguage(data.language)
      return null
    }
  }

  return isSuccess ? (
    <>
      {props.children}
      <UpgradeModalGroup />
    </>
  ) : null
}

export default LoginAuth
