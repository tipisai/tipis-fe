import { Button, ConfigProvider, Radio } from "antd"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "@illa-public/color-scheme"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { WOO_UNIT_PRICE } from "@illa-public/upgrade-modal"
import CollaCardPcBg from "@/page/SettingPage/team/billing/assets/collaCardPcBg.svg?react"
import { WOO_LIST } from "../constant"
import { WooCardProps } from "../interface"
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

const WooCardPC: FC<WooCardProps> = ({ openWooDrawer }) => {
  const { t } = useTranslation()
  const [cycle, setCycle] = useState(SUBSCRIPTION_CYCLE.MONTHLY)
  const price =
    cycle === SUBSCRIPTION_CYCLE.MONTHLY
      ? WOO_UNIT_PRICE[cycle]
      : (WOO_UNIT_PRICE[cycle] / 12).toFixed(1)

  return (
    <div css={containerStyle}>
      <div css={headerStyle}>
        <span css={titleStyle}>{t("billing.new_pricing.colla")}</span>
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
              <span css={labelStyle}>{t("billing.new_pricing.monthly")}</span>
            </Radio>
            <Radio
              checked={cycle === SUBSCRIPTION_CYCLE.YEARLY}
              onChange={() => setCycle(SUBSCRIPTION_CYCLE.YEARLY)}
            >
              <span css={labelStyle}>{t("billing.new_pricing.annually")}</span>
            </Radio>
          </ConfigProvider>
        </div>
      </div>
      <div css={cardContainerStyle}>
        <CollaCardPcBg css={bgStyle} />
        <div css={cardHeaderStyle}>
          <div css={priceStyle}>
            <span css={priceNumStyle}>${price}</span>
            <span css={priceUnitStyle}>
              {t("billing.new_pricing.colla_month")}
            </span>
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => openWooDrawer(cycle)}
          >
            {t("billing.new_pricing.upgrade")}
          </Button>
        </div>
        <div css={cardContentStyle}>
          {WOO_LIST.map(({ label, desc }) => (
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

export default WooCardPC
