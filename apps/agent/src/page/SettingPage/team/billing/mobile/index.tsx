import { useContext } from "react"
import { useTranslation } from "react-i18next"
import FullSectionLoading from "@/components/FullSectionLoading"
import { LicenseCard } from "@/page/SettingPage/team/billing/components/LicenseCard"
import { Price } from "@/page/SettingPage/team/billing/components/Price"
import { WooUsage } from "@/page/SettingPage/team/billing/components/WooUsage"
import { BillingContext } from "@/page/SettingPage/team/billing/context"
import {
  billingHeaderStyle,
  billingMainContentStyle,
  contentContainerStyle,
  pageWrapperStyle,
} from "./style"

export const BillingMobilePage = () => {
  const { t } = useTranslation()
  const { wooInfo, loading } = useContext(BillingContext)
  if (!wooInfo) return null
  return (
    <div css={pageWrapperStyle}>
      {loading ? (
        <FullSectionLoading />
      ) : (
        <>
          <div css={billingHeaderStyle}>
            <span>{t("billing.title.billing")}</span>
          </div>
          <div css={billingMainContentStyle}>
            <div css={contentContainerStyle}>
              <LicenseCard />
              <Price />
              <WooUsage />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
