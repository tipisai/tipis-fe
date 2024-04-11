import { Button, ConfigProvider, Radio } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { CREDIT_UNIT_PRICE } from "@illa-public/upgrade-modal"
import CollaCardPcBg from "@/page/SettingPage/team/billing/assets/collaCardPcBg.svg?react"
import { CREDIT_LIST } from "../constant"
import { CreditCardProps } from "../interface"
import {
  bgStyle,
  cardContainerStyle,
  cardContentStyle,
  cardHeaderStyle,
  cardItemContainerStyle,
  cardItemDescStyle,
  cardItemLabelStyle,
  containerStyle,
  headerStyle,
  labelStyle,
  priceNumStyle,
  priceStyle,
  priceUnitStyle,
  radioContainerStyle,
  titleStyle,
} from "./style"

const CreditCardPC: FC<CreditCardProps> = ({ openCreditDrawer }) => {
  const { t } = useTranslation()
  const [cycle, setCycle] = useState(SUBSCRIPTION_CYCLE.MONTHLY)

  return (
    <div css={containerStyle}>
      <div css={headerStyle}>
        <span css={titleStyle}>{t("tipi_billing.credit")}</span>
        <div css={radioContainerStyle}>
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  colorPrimary: getColor("grayBlue", "02"),
                },
              },
            }}
          >
            <Radio
              checked={cycle === SUBSCRIPTION_CYCLE.MONTHLY}
              onChange={() => setCycle(SUBSCRIPTION_CYCLE.MONTHLY)}
            >
              <span css={labelStyle}>{t("tipi_billing.monthly")}</span>
            </Radio>
            <Radio
              checked={cycle === SUBSCRIPTION_CYCLE.YEARLY}
              onChange={() => setCycle(SUBSCRIPTION_CYCLE.YEARLY)}
            >
              <span css={labelStyle}>{t("tipi_billing.annual")}</span>
            </Radio>
          </ConfigProvider>
        </div>
      </div>
      <div css={cardContainerStyle}>
        <CollaCardPcBg css={bgStyle} />
        <div css={cardHeaderStyle}>
          <div css={priceStyle}>
            <span css={priceNumStyle}>${CREDIT_UNIT_PRICE[cycle]}</span>
            <span css={priceUnitStyle}>
              {cycle === SUBSCRIPTION_CYCLE.MONTHLY
                ? t("tipi_billing.monthly_price_unit")
                : t("tipi_billing.annual_price_unit")}
            </span>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => openCreditDrawer(cycle)}
          >
            {t("tipi_billing.upgrade")}
          </Button>
        </div>
        <div css={cardContentStyle}>
          {CREDIT_LIST.map(({ label, desc }) => (
            <div key={label} css={cardItemContainerStyle}>
              <span css={cardItemLabelStyle}>{label}</span>
              <span css={cardItemDescStyle}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreditCardPC
