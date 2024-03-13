import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { COLLAR_UNIT_PRICE } from "@illa-public/upgrade-modal"
import CollaCardMobileBg from "@/page/SettingPage/team/billing/assets/collaCardMobileBg.svg"
import { COLLA_LIST } from "../constant"
import { WooCardProps } from "../interface"
import {
  bgStyle,
  cardContainerStyle,
  cardContentStyle,
  cardItemContainerStyle,
  cardItemDescStyle,
  cardItemLabelStyle,
  containerStyle,
  priceNumStyle,
  priceStyle,
  priceUnitStyle,
  titleStyle,
} from "./style"

const WooCardMobile: FC<WooCardProps> = ({ openWooDrawer }) => {
  const { t } = useTranslation()
  const price = COLLAR_UNIT_PRICE[SUBSCRIPTION_CYCLE.MONTHLY]
  return (
    <div css={containerStyle}>
      <span css={titleStyle}>{t("billing.new_pricing.colla")}</span>
      <div css={cardContainerStyle}>
        <img src={CollaCardMobileBg} css={bgStyle} />
        <div css={priceStyle}>
          <span css={priceNumStyle}>${price}</span>
          <span css={priceUnitStyle}>
            {t("billing.new_pricing.colla_month")}
          </span>
        </div>
        <div css={cardContentStyle}>
          {COLLA_LIST.map(({ label, desc }) => (
            <div key={label} css={cardItemContainerStyle}>
              <span css={cardItemLabelStyle}>{label}</span>
              <span css={cardItemDescStyle}>{desc}</span>
            </div>
          ))}
        </div>
        <Button
          type="primary"
          block
          size="large"
          onClick={() => openWooDrawer()}
        >
          {t("billing.new_pricing.upgrade")}
        </Button>
      </div>
    </div>
  )
}

export default WooCardMobile
