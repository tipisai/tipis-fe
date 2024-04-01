import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import MemberListPage from "../components/Member"

const TeamMembers = () => {
  const { t } = useTranslation()
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
