import { RDT_EVENT } from "./constent"

export const linkTrk = (conversionId: number) => {
  if (
    import.meta.env.ILLA_APP_ENV &&
    import.meta.env.ILLA_APP_ENV === "production"
  ) {
    window &&
      window.lintrk &&
      window.lintrk("track", { conversion_id: conversionId })
  }
}

export const twqTrk = (conversionId: string, userId?: string) => {
  if (
    import.meta.env.ILLA_APP_ENV &&
    import.meta.env.ILLA_APP_ENV === "production"
  ) {
    typeof twq !== undefined &&
      twq &&
      twq("event", conversionId, {
        conversion_id: userId,
      })
  }
}

export const rdtSignUpTrk = (userId?: string) => {
  if (
    import.meta.env.ILLA_APP_ENV &&
    import.meta.env.ILLA_APP_ENV === "production"
  ) {
    typeof rdt !== undefined &&
      rdt &&
      rdt("track", RDT_EVENT.SIGNUP, {
        transactionId: userId,
      })
  }
}

export const rdtPurchaseTrk = (
  count: string,
  value: string,
  type: string,
  userId?: string,
) => {
  if (
    import.meta.env.ILLA_APP_ENV &&
    import.meta.env.ILLA_APP_ENV === "production"
  ) {
    typeof rdt !== undefined &&
      rdt &&
      rdt("track", RDT_EVENT.PURCHASE, {
        currency: "USD",
        transactionId: userId,
        itemCount: count,
        value,
        products: [
          {
            id: type,
            name: type,
            category: type,
          },
        ],
      })
  }
}
