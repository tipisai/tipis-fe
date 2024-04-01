import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import MemberListPage from "../components/Member"

const TeamMembers = () => {
  const { t } = useTranslation()
  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_MEMBER)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_MEMBER)
    }
  }, [])
  return (
    <>
      <Helmet>
        <title>{t("user_management.page.member")}</title>
      </Helmet>
      <MemberListPage />
    </>
  )
}
export default TeamMembers
