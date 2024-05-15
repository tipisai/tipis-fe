// import { isEqual } from "lodash-es"
// import { FC } from "react"
// import { Navigate } from "react-router-dom"
// import { TipisTrack } from "@illa-public/track-utils"
// import { UpgradeModalGroup } from "@illa-public/upgrade-modal"
// import { useGetUserInfoQuery } from "@illa-public/user-data"
// import i18n from "@/i18n"
// import { BaseProtectComponentProps } from "@/router/interface"
// import {
//   getSessionCurrentUserInfo,
//   setSessionCurrentUserInfo,
// } from "@/utils/storage/user"

// const LoginAuth: FC<BaseProtectComponentProps> = (props) => {
//   const { data, isSuccess, error } = useGetUserInfoQuery(null, {
//     refetchOnFocus: true,
//     refetchOnReconnect: true,
//   })

//   const cacheCurrentUserInfo = getSessionCurrentUserInfo()

//   if (error && "status" in error) {
//     return <Navigate to="/404" />
//   }

//   if (data) {
//     const currentLng = i18n.language
//     if (!isEqual(cacheCurrentUserInfo, data)) {
//       setSessionCurrentUserInfo(data)
//       TipisTrack.identify(data.userID, {
//         nickname: data.nickname,
//         email: data.email,
//         language: data.language,
//       })
//     }

//     if (data.language && data.language !== currentLng) {
//       i18n.changeLanguage(data.language)
//       return null
//     }
//   }

//   return isSuccess ? (
//     <>
//       {props.children}
//       <UpgradeModalGroup />
//     </>
//   ) : null
// }

// export default LoginAuth

export {}
