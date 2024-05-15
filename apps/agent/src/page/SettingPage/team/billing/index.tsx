import { FC, useCallback, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useTranslation } from "react-i18next"
import { Navigate, useBeforeUnload } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { SUBSCRIBE_PLAN, SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import { useCreditDrawer } from "@illa-public/upgrade-modal"
import { BILLING_REPORT_FROM } from "@illa-public/upgrade-modal/constants"
import {
  useGetTeamSubscriptionQuery,
  useLazyGetTeamsInfoQuery,
} from "@illa-public/user-data"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { BillingContext } from "./context"
import { BillingMobilePage } from "./mobile"
import { BillingPCPage } from "./pc"

const Billing: FC = () => {
  const creditDrawer = useCreditDrawer()
  const [loading, setLoading] = useState(false)
  const teamInfo = useGetCurrentTeamInfo()!
  const { data, isError, isLoading, refetch } = useGetTeamSubscriptionQuery(
    teamInfo.id,
  )
  const { t } = useTranslation()

  const [triggerGetTeamsInfo] = useLazyGetTeamsInfoQuery()
  const creditInfo = data?.credit?.current

  const fetchSubscriptionInfo = useCallback(async () => {
    if (!teamInfo?.id) return
    setLoading(true)
    try {
      refetch()
      triggerGetTeamsInfo(null)
      TipisTrack.group(teamInfo.id, {
        name: teamInfo.name,
        identifier: teamInfo.identify,
        paymentPlan: teamInfo.credit.plan,
        cycle: teamInfo.credit.cycle,
      })
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [
    refetch,
    teamInfo.credit.cycle,
    teamInfo.credit.plan,
    teamInfo.id,
    teamInfo.identify,
    teamInfo.name,
    triggerGetTeamsInfo,
  ])

  const openCreditDrawer = useCallback(
    (subCycle?: SUBSCRIPTION_CYCLE) => {
      creditDrawer(BILLING_REPORT_FROM.SETTING_BILLING, {
        onSuccessCallback: fetchSubscriptionInfo,
        subCycle,
      })
    },
    [creditDrawer, fetchSubscriptionInfo],
  )

  const isUnSubscribeCredit =
    !creditInfo?.plan || creditInfo?.plan === SUBSCRIBE_PLAN.CREDIT_FREE

  const isCancelSubscribedCredit =
    creditInfo?.plan === SUBSCRIBE_PLAN.CREDIT_SUBSCRIBE_CANCELED

  const isExpiredCredit =
    creditInfo?.plan === SUBSCRIBE_PLAN.CREDIT_SUBSCRIBE_EXPIRED

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_BILLING)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_BILLING)
    }
  }, [])

  useBeforeUnload(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_BILLING)
  })

  if (isError) return <Navigate to="/500" />
  if (isLoading) return <FullSectionLoading />
  return creditInfo ? (
    <>
      <Helmet>
        <title>{t("billing.title.billing")}</title>
      </Helmet>
      <BillingContext.Provider
        value={{
          creditInfo,
          isExpiredCredit,
          isUnSubscribeCredit,
          isCancelSubscribedCredit,
          loading,
          openCreditDrawer,
        }}
      >
        <LayoutAutoChange
          desktopPage={<BillingPCPage />}
          mobilePage={<BillingMobilePage />}
        />
      </BillingContext.Provider>
    </>
  ) : null
}

export default Billing
