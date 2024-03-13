import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { infoTitleStyle } from "@/page/SettingPage/team/billing/style"
import { WooCard } from "./WooCard"
import {
  cardDetailContainerStyle,
  licenseCardContainerStyle,
  teamInfoStyle,
} from "./style"

export const LicenseCard: FC = () => {
  const { t } = useTranslation()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)

  return (
    <section css={licenseCardContainerStyle} id="license">
      <span css={infoTitleStyle}>{t("billing.menu.overview")}</span>
      <div css={teamInfoStyle}>
        <img src={currentTeamInfo?.icon} />
        <span>{currentTeamInfo?.name}</span>
      </div>
      <div css={cardDetailContainerStyle}>
        <WooCard />
      </div>
    </section>
  )
}
