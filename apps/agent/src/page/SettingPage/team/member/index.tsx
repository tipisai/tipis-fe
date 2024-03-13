// import { FC, useEffect } from "react"
// import { LayoutAutoChange } from "@illa-public/layout-auto-change"
// import {
//   ILLA_MIXPANEL_CLOUD_PAGE_NAME,
//   MixpanelTrackProvider,
// } from "@illa-public/mixpanel-utils"
// import useBeforeUnload from "@/hooks/useBeforeUnload"
// import SettingMobileLayout from "@/page/SettingPage/layout/mobile"
// import { Member } from "@/page/member"
// import {
//   track,
//   trackPageDurationEnd,
//   trackPageDurationStart,
// } from "@/utils/mixpanelHelper"

// const TeamMembers: FC = () => {
//   useEffect(() => {
//     trackPageDurationStart()
//     return () => {
//       trackPageDurationEnd(ILLA_MIXPANEL_CLOUD_PAGE_NAME.MEMBER)
//     }
//   }, [])

//   useBeforeUnload(() => {
//     trackPageDurationEnd(ILLA_MIXPANEL_CLOUD_PAGE_NAME.MEMBER)
//   })
//   return (
//     <MixpanelTrackProvider
//       basicTrack={track}
//       pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_MEMBER}
//     >
//       <LayoutAutoChange
//         desktopPage={<Member />}
//         mobilePage={
//           <SettingMobileLayout>
//             <Member />
//           </SettingMobileLayout>
//         }
//       />
//     </MixpanelTrackProvider>
//   )
// }

// export default TeamMembers

const TeamMembers = () => {
  return <></>
}
export default TeamMembers
