import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { BillingContext } from "../../context"
import WooCard from "./components/WooCard"
import { infoTitleStyle, priceCardContainerStyle, priceStyle } from "./style"

export const Price = () => {
  const { t } = useTranslation()
  const { isUnSubscribeWoo, isExpiredWoo } = useContext(BillingContext)

  if (!isUnSubscribeWoo && !isExpiredWoo) {
    return null
  }
  return (
    <section css={priceStyle} id="pricing">
      <span css={infoTitleStyle}>{t("billing.title.pricing")}</span>
      <div css={priceCardContainerStyle}>
        {(isUnSubscribeWoo || isExpiredWoo) && <WooCard />}
      </div>
    </section>
  )
}
