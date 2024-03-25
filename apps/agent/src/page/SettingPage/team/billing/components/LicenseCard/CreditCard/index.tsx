import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import dayjs from "dayjs"
import { FC, useContext, useRef } from "react"
import { useTranslation } from "react-i18next"
import { DoubtIcon } from "@illa-public/icon"
import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import { CREDIT_UNIT_BY_CYCLE } from "@illa-public/upgrade-modal"
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

export const CreditCard: FC = () => {
  const { t } = useTranslation()
  const { openCreditDrawer } = useContext(BillingContext)
  const titleRef = useRef<HTMLSpanElement>(null)
  const {
    creditInfo,
    isCancelSubscribedCredit,
    isExpiredCredit,
    isUnSubscribeCredit,
  } = useContext(BillingContext)

  const cycleKey =
    creditInfo?.cycle === SUBSCRIPTION_CYCLE.MONTHLY ? "month" : "year"

  const creditPayedInfo = `$${
    creditInfo?.totalAmount ?? 0
  } ${t(`billing.subscription_general.billing_cyle.${cycleKey}`)}`

  const creditNum =
    (creditInfo?.quantity ?? 0) * CREDIT_UNIT_BY_CYCLE[creditInfo?.cycle] * 1000

  const showBonus =
    creditInfo?.bonusConverted && creditInfo?.bonusConverted !== 0

  return (
    <div css={cardStyle}>
      <div css={cardTitleStyle}>
        <div css={collarCardNameStyle}>
          <span>Credit</span>
          <Tooltip
            trigger="hover"
            title={t("billing.subscription_general.colla.desc")}
          >
            <span css={doubtColorStyle} ref={titleRef}>
              <Icon component={DoubtIcon} />
            </span>
          </Tooltip>
        </div>
        {!isUnSubscribeCredit &&
          !isCancelSubscribedCredit &&
          !isExpiredCredit && <span css={payInfoStyle}>{creditPayedInfo}</span>}
        {isExpiredCredit && (
          <span css={payInfoExpiredStyle}>{t("billing.label.expired")}</span>
        )}
        {isCancelSubscribedCredit && (
          <span css={payInfoCancelStyle}>{t("billing.label.canceled")}</span>
        )}
      </div>
      <div css={cardPayDetailStyle}>
        <div css={cardPayDetailItemStyle}>
          <span css={cardPayDetailNameStyle}>
            {isUnSubscribeCredit || isExpiredCredit
              ? t("billing.subscription_general.table_title.colla_unsub")
              : t("billing.subscription_general.table_title.colla_sub")}
          </span>
          <span css={cardPayDetailNumStyle}>
            {toThousands(
              (isUnSubscribeCredit || isExpiredCredit
                ? creditInfo?.balanceConverted
                : creditNum) || 0,
            )}
          </span>
        </div>
        <div css={cardPayDetailItemStyle}>
          <span css={cardPayDetailNameStyle}>
            {isCancelSubscribedCredit
              ? t("billing.subscription_general.table_title.expiration_date")
              : t("drive.capacity_usage.next_renewal_date")}
          </span>
          <span css={cardPayDetailNumStyle}>
            {isUnSubscribeCredit || isExpiredCredit
              ? "--"
              : dayjs(creditInfo?.invoiceIssueDate).format("L")}
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
              {toThousands(creditInfo?.bonusConverted)}
            </span>
          </div>
        )}
      </div>
      {!isExpiredCredit && !isUnSubscribeCredit && (
        <Button onClick={openCreditDrawer}>
          {t("billing.subscription_general.table_button.colla")}
        </Button>
      )}
    </div>
  )
}
