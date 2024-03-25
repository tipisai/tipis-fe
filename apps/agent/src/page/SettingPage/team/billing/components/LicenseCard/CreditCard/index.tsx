import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import dayjs from "dayjs"
import { FC, useContext, useRef } from "react"
import { useTranslation } from "react-i18next"
import { DoubtIcon } from "@illa-public/icon"
import { CREDIT_UNIT_BY_CYCLE } from "@illa-public/upgrade-modal"
import { BillingContext } from "@/page/SettingPage/team/billing/context"
import { toThousands } from "@/utils/billing/toThousands"
import {
  cardPayDetailItemStyle,
  cardPayDetailNameStyle,
  cardPayDetailNumStyle,
  cardPayDetailStyle,
  cardStyle,
  cardTitleStyle,
  collarCardNameStyle,
  doubtColorStyle,
  payInfoCancelStyle,
  payInfoExpiredStyle,
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

  const creditNum =
    (creditInfo?.quantity ?? 0) * CREDIT_UNIT_BY_CYCLE[creditInfo?.cycle] * 1000

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
        {!isExpiredCredit &&
          !isUnSubscribeCredit &&
          !isCancelSubscribedCredit && (
            <Button onClick={openCreditDrawer}>
              {t("billing.subscription_general.table_button.colla")}
            </Button>
          )}

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
            {t("billing.subscription_general.table_title.colla_unsub")}
          </span>
          <span css={cardPayDetailNumStyle}>
            {toThousands(creditInfo?.balanceConverted || 0)}
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
        {!isUnSubscribeCredit &&
          !isExpiredCredit &&
          !isCancelSubscribedCredit && (
            <div css={cardPayDetailItemStyle}>
              <span css={cardPayDetailNameStyle}>
                {t("billing.subscription_general.table_title.colla_sub")}
              </span>
              <span css={cardPayDetailNumStyle}>
                {toThousands(creditNum || 0)}
              </span>
            </div>
          )}
      </div>
    </div>
  )
}
