import { useContext } from "react"
import { useTranslation } from "react-i18next"
import FullSectionLoading from "@/components/FullSectionLoading"
import { GoToPortal } from "@/page/SettingPage/components/GoToPortal"
import { CreditUsage } from "@/page/SettingPage/team/billing/components/CreditUsage"
import { LicenseCard } from "@/page/SettingPage/team/billing/components/LicenseCard"
import { Price } from "@/page/SettingPage/team/billing/components/Price"
import { BillingContext } from "@/page/SettingPage/team/billing/context"
import {
  billingHeaderStyle,
  billingMainContentStyle,
  contentContainerStyle,
  pageWrapperStyle,
} from "./style"

export const BillingMobilePage = () => {
  const { t } = useTranslation()
  const { creditInfo, loading } = useContext(BillingContext)
  if (!creditInfo) return null
  return (
    <div css={pageWrapperStyle}>
      {loading ? (
        <FullSectionLoading />
      ) : (
        <>
          <GoToPortal />
          <div css={billingHeaderStyle}>
            <span>{t("billing.title.billing")}</span>
          </div>
          <div css={billingMainContentStyle}>
            <div css={contentContainerStyle}>
              <LicenseCard />
              <Price />
              <CreditUsage />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
