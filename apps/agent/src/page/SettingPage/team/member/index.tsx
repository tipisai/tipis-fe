import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { track } from "@/utils/mixpanelHelper"
import MemberListPage from "../../components/Member"

const TeamMembers = () => {
  return (
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_MEMBER}
    >
      <LayoutAutoChange
        desktopPage={<MemberListPage />}
        mobilePage={<MemberListPage />}
      />
    </MixpanelTrackProvider>
  )
}
export default TeamMembers
