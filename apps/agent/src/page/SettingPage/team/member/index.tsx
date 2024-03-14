import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { track } from "@/utils/mixpanelHelper"
import MemberListPage from "../../components/Member"
import SettingMobileLayout from "../../layout/mobile"

const TeamMembers = () => {
  return (
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_MEMBER}
    >
      <LayoutAutoChange
        desktopPage={<MemberListPage />}
        mobilePage={
          <SettingMobileLayout>
            <MemberListPage />
          </SettingMobileLayout>
        }
      />
    </MixpanelTrackProvider>
  )
}
export default TeamMembers
