import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { track } from "@/utils/mixpanelHelper"
import MemberListPage from "../components/Member"

const TeamMembers = () => {
  const { t } = useTranslation()
  return (
    <>
      <Helmet>
        <title>{t("user_management.page.member")}</title>
      </Helmet>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_MEMBER}
      >
        <MemberListPage />
      </MixpanelTrackProvider>
    </>
  )
}
export default TeamMembers
