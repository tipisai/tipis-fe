import { Button } from "antd"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import {
  CREDIT_UNIT_BY_CYCLE,
  CREDIT_UNIT_PRICE,
} from "@illa-public/upgrade-modal"
import CollaCardMobileBg from "@/page/SettingPage/team/billing/assets/collaCardMobileBg.svg"
import { toThousands } from "@/utils/billing/toThousands"
import { CREDIT_LIST } from "../constant"
import { CreditCardProps } from "../interface"
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

const CreditCardMobile: FC<CreditCardProps> = ({ openCreditDrawer }) => {
  const { t } = useTranslation()
  const price = CREDIT_UNIT_PRICE[SUBSCRIPTION_CYCLE.MONTHLY]
  return (
    <div css={containerStyle}>
      <span css={titleStyle}>{t("tipi_billing.credit")}</span>
      <div css={cardContainerStyle}>
        <img src={CollaCardMobileBg} css={bgStyle} />
        <div css={priceStyle}>
          <span css={priceNumStyle}>${price}</span>
          <span css={priceUnitStyle}>
            {t("tipi_billing.monthly_price_unit", {
              unit: toThousands(
                CREDIT_UNIT_BY_CYCLE[SUBSCRIPTION_CYCLE.MONTHLY],
              ),
            })}
          </span>
        </div>
        <div css={cardContentStyle}>
          {CREDIT_LIST.map(({ label, desc }) => (
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
          onClick={() => openCreditDrawer()}
        >
          {t("tipi_billing.upgrade")}
        </Button>
      </div>
    </div>
  )
}

export default CreditCardMobile
