import { FC, useCallback, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { SUBSCRIBE_PLAN } from "@illa-public/public-types"
import { useCollarDrawer } from "@illa-public/upgrade-modal"
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
  const wooDrawer = useCollarDrawer()
  const [loading, setLoading] = useState(false)
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const { data, isError, isLoading, refetch } = useGetTeamSubscriptionQuery(
    teamInfo.id,
  )

  const wooInfo = data?.colla?.current

  const [triggerGetTeamsInfo] = useLazyGetTeamsInfoQuery()

  const fetchSubscriptionInfo = useCallback(async () => {
    if (!teamInfo?.id) return
    setLoading(true)
    try {
      refetch()
      await triggerGetTeamsInfo({}).unwrap()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [refetch, teamInfo?.id, triggerGetTeamsInfo])

  const openWooDrawer = useCallback(() => {
    wooDrawer("billing_manage_woo", {
      onSuccessCallback: fetchSubscriptionInfo,
    })
  }, [wooDrawer, fetchSubscriptionInfo])

  const isUnSubscribeWoo =
    !wooInfo?.plan || wooInfo?.plan === SUBSCRIBE_PLAN.COLLA_FREE

  const isCancelSubscribedWoo =
    wooInfo?.plan === SUBSCRIBE_PLAN.COLLA_SUBSCRIBE_CANCELED

  const isExpiredWoo = wooInfo?.plan === SUBSCRIBE_PLAN.COLLA_SUBSCRIBE_EXPIRED
  if (isError) return <Navigate to="/500" />
  if (isLoading) return <FullSectionLoading />
  return wooInfo ? (
    <BillingContext.Provider
      value={{
        wooInfo,
        isExpiredWoo,
        isUnSubscribeWoo,
        isCancelSubscribedWoo,
        loading,
        openWooDrawer,
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
