import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import dayjs from "dayjs"
import { FC, useContext, useRef } from "react"
import { useTranslation } from "react-i18next"
import { DoubtIcon } from "@illa-public/icon"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { WOO_UNIT_BY_CYCLE } from "@illa-public/upgrade-modal"
import { BillingContext } from "@/page/SettingPage/team/billing/context"
import { toThousands } from "@/utils/billing/toThousands"
import {
  bonusStyle, // cardManageButtonStyle,
  cardPayDetailItemStyle,
  cardPayDetailNameStyle,
  cardPayDetailNumStyle,
  cardPayDetailStyle,
  cardStyle,
  cardTitleStyle,
  collarCardNameStyle,
  collarCardPayDetailNameStyle,
  doubtColorStyle,
  payInfoCancelStyle,
  payInfoExpiredStyle,
  payInfoStyle,
} from "../style"

export const WooCard: FC = () => {
  const { t } = useTranslation()
  const { openWooDrawer } = useContext(BillingContext)
  const titleRef = useRef<HTMLSpanElement>(null)
  const { wooInfo, isCancelSubscribedWoo, isExpiredWoo, isUnSubscribeWoo } =
    useContext(BillingContext)

  const cycleKey =
    wooInfo?.cycle === SUBSCRIPTION_CYCLE.MONTHLY ? "month" : "year"

  const wooPayedInfo = `$${
    wooInfo?.totalAmount ?? 0
  } ${t(`billing.subscription_general.billing_cyle.${cycleKey}`)}`

  const wooNum =
    (wooInfo?.quantity ?? 0) * WOO_UNIT_BY_CYCLE[wooInfo?.cycle] * 1000

  const showBonus = wooInfo?.bonusConverted && wooInfo?.bonusConverted !== 0

  return (
    <div css={cardStyle}>
      <div css={cardTitleStyle}>
        <div css={collarCardNameStyle}>
          <span>Woo</span>
          <Tooltip
            trigger="hover"
            title={t("billing.subscription_general.colla.desc")}
          >
            <span css={doubtColorStyle} ref={titleRef}>
              <Icon component={DoubtIcon} />
            </span>
          </Tooltip>
        </div>
        {!isUnSubscribeWoo && !isCancelSubscribedWoo && !isExpiredWoo && (
          <span css={payInfoStyle}>{wooPayedInfo}</span>
        )}
        {isExpiredWoo && (
          <span css={payInfoExpiredStyle}>{t("billing.label.expired")}</span>
        )}
        {isCancelSubscribedWoo && (
          <span css={payInfoCancelStyle}>{t("canceled")}</span>
        )}
      </div>
      <div css={cardPayDetailStyle}>
        <div css={cardPayDetailItemStyle}>
          <span css={cardPayDetailNameStyle}>
            {isUnSubscribeWoo || isExpiredWoo
              ? t("billing.subscription_general.table_title.colla_unsub")
              : t("billing.subscription_general.table_title.colla_sub")}
          </span>
          <span css={cardPayDetailNumStyle}>
            {toThousands(
              (isUnSubscribeWoo || isExpiredWoo
                ? wooInfo?.balanceConverted
                : wooNum) || 0,
            )}
          </span>
        </div>
        <div css={cardPayDetailItemStyle}>
          <span css={cardPayDetailNameStyle}>
            {isCancelSubscribedWoo
              ? t("billing.subscription_general.table_title.expiration_date")
              : t("drive.capacity_usage.next_renewal_date")}
          </span>
          <span css={cardPayDetailNumStyle}>
            {isUnSubscribeWoo || isExpiredWoo
              ? "--"
              : dayjs(wooInfo?.invoiceIssueDate).format("L")}
          </span>
        </div>
        {!!showBonus && (
          <div css={bonusStyle}>
            <div css={collarCardPayDetailNameStyle}>
              <span>{t("billing.subscription_general.table_title.bouns")}</span>
              <Tooltip
                trigger="hover"
                title={t("billing.subscription_general.table_desc.bouns")}
              >
                <Icon component={DoubtIcon} css={doubtColorStyle} />
              </Tooltip>
            </div>
            <span css={cardPayDetailNumStyle}>
              {toThousands(wooInfo?.bonusConverted)}
            </span>
          </div>
        )}
      </div>
      {!isExpiredWoo && !isUnSubscribeWoo && (
        <Button onClick={openWooDrawer}>
          {t("billing.subscription_general.table_button.colla")}
        </Button>
      )}
    </div>
  )
}
