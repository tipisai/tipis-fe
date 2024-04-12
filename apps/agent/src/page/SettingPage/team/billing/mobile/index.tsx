import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { SUBSCRIBE_PLAN } from "@illa-public/public-types"
import { getPlanUtils } from "@illa-public/user-data"
import { canManagePayment } from "@illa-public/user-role-utils"
import FullSectionLoading from "@/components/FullSectionLoading"
import { GoToPortal } from "@/page/SettingPage/components/GoToPortal"
import CreditCard from "@/page/SettingPage/team/billing/components/CreditCard"
import { CreditUsage } from "@/page/SettingPage/team/billing/components/CreditUsage"
import { Price } from "@/page/SettingPage/team/billing/components/Price"
import { BillingContext } from "@/page/SettingPage/team/billing/context"
import { useGetCurrentTeamInfo } from "@/utils/team"
import {
  billingHeaderStyle,
  billingMainContentStyle,
  contentContainerStyle,
  pageWrapperStyle,
} from "./style"

export const BillingMobilePage = () => {
  const { t } = useTranslation()
  const { creditInfo, loading } = useContext(BillingContext)
  const currentTeamInfo = useGetCurrentTeamInfo()
  const showBilling = canManagePayment(
    currentTeamInfo?.myRole,
    getPlanUtils(currentTeamInfo),
    currentTeamInfo?.totalTeamLicense?.teamLicenseAllPaid,
  )
  const isPurchased = creditInfo?.plan !== SUBSCRIBE_PLAN.CREDIT_FREE

  if (!creditInfo) return null
  return (
    <div css={pageWrapperStyle}>
      {loading ? (
        <FullSectionLoading />
      ) : (
        <>
          {showBilling && isPurchased && <GoToPortal />}
          <div css={billingHeaderStyle}>
            <span>{t("billing.title.billing")}</span>
          </div>
          <div css={billingMainContentStyle}>
            <div css={contentContainerStyle}>
              <CreditCard />
              <Price />
              <CreditUsage />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
