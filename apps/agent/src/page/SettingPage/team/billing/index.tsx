import { FC, useCallback, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { SUBSCRIBE_PLAN } from "@illa-public/public-types"
import { useCreditDrawer } from "@illa-public/upgrade-modal"
import {
  getCurrentTeamInfo,
  useGetTeamSubscriptionQuery,
  useLazyGetTeamsInfoQuery,
} from "@illa-public/user-data"
import FullSectionLoading from "@/components/FullSectionLoading"
import { BillingContext } from "./context"
import { BillingMobilePage } from "./mobile"
import { BillingPCPage } from "./pc"

const Billing: FC = () => {
  const creditDrawer = useCreditDrawer()
  const [loading, setLoading] = useState(false)
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const { data, isError, isLoading, refetch } = useGetTeamSubscriptionQuery(
    teamInfo.id,
  )

  const [triggerGetTeamsInfo] = useLazyGetTeamsInfoQuery()
  const creditInfo = data?.credit?.current

  const fetchSubscriptionInfo = useCallback(async () => {
    if (!teamInfo?.id) return
    setLoading(true)
    try {
      refetch()
      triggerGetTeamsInfo(null)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [refetch, teamInfo?.id, triggerGetTeamsInfo])

  const openCreditDrawer = useCallback(() => {
    creditDrawer("billing_manage_credit", {
      onSuccessCallback: fetchSubscriptionInfo,
    })
  }, [creditDrawer, fetchSubscriptionInfo])

  const isUnSubscribeCredit =
    !creditInfo?.plan || creditInfo?.plan === SUBSCRIBE_PLAN.CREDIT_FREE

  const isCancelSubscribedCredit =
    creditInfo?.plan === SUBSCRIBE_PLAN.CREDIT_SUBSCRIBE_CANCELED

  const isExpiredCredit =
    creditInfo?.plan === SUBSCRIBE_PLAN.CREDIT_SUBSCRIBE_EXPIRED
  if (isError) return <Navigate to="/500" />
  if (isLoading) return <FullSectionLoading />
  return creditInfo ? (
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
  ) : null
}

export default Billing
