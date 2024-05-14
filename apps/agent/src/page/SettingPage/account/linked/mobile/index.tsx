// import Icon from "@ant-design/icons"
// import { FC } from "react"
// import { useTranslation } from "react-i18next"
// import { GithubIcon } from "@illa-public/icon"
// import { useGetUserInfoQuery } from "@illa-public/user-data"
// import { LinkCard } from "../components/LinkCard"

// export const MobileLinkedSetting: FC = () => {
//   const { t } = useTranslation()

//   const { data } = useGetUserInfoQuery(null)
//   const ssoVerified = data?.ssoVerified
//   const hasPassword = data?.isPasswordSet

//   return (
//     <LinkCard
//       title="Github"
//       description={t("profile.setting.oauth.description.GitHub_unconnect")}
//       icon={<Icon component={GithubIcon} />}
//       type="github"
//       isConnected={ssoVerified?.github ?? false}
//       hasPassword={hasPassword ?? false}
//     />
//   )
// }

export {}
