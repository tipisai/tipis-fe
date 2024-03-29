import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { BillingContext } from "../../context"
import PriceCard from "./components/PriceCard"
import { infoTitleStyle, priceCardContainerStyle, priceStyle } from "./style"

export const Price = () => {
  const { t } = useTranslation()
  const { isUnSubscribeCredit, isExpiredCredit } = useContext(BillingContext)

  if (!isUnSubscribeCredit && !isExpiredCredit) {
    return null
  }
  return (
    <section css={priceStyle} id="pricing">
      <span css={infoTitleStyle}>{t("tipi_billing.pricing")}</span>
      <div css={priceCardContainerStyle}>
        {(isUnSubscribeCredit || isExpiredCredit) && <PriceCard />}
      </div>
    </section>
  )
}
