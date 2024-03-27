import { SUBSCRIBE_PLAN } from "@illa-public/public-types"

export const isSubscribeForBilling = (subscribePlan?: SUBSCRIBE_PLAN) => {
  return (
    subscribePlan === SUBSCRIBE_PLAN.CREDIT_SUBSCRIBE_INSUFFICIENT ||
    subscribePlan === SUBSCRIBE_PLAN.CREDIT_SUBSCRIBE_PAID ||
    subscribePlan === SUBSCRIBE_PLAN.CREDIT_SUBSCRIBE_CANCELED
  )
}
