import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { BillingContext } from "../../context"
import CreditCard from "./components/WooCard"
import { infoTitleStyle, priceCardContainerStyle, priceStyle } from "./style"

export const Price = () => {
  const { t } = useTranslation()
  const { isUnSubscribeCredit, isExpiredCredit } = useContext(BillingContext)

  if (!isUnSubscribeCredit && !isExpiredCredit) {
    return null
  }
  return (
    <section css={priceStyle} id="pricing">
      <span css={infoTitleStyle}>{t("billing.title.pricing")}</span>
      <div css={priceCardContainerStyle}>
        {(isUnSubscribeCredit || isExpiredCredit) && <CreditCard />}
      </div>
    </section>
  )
}
