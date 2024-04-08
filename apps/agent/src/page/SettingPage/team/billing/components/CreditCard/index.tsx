import Icon from "@ant-design/icons"
import { Button, Tooltip } from "antd"
import dayjs from "dayjs"
import { FC, useContext, useRef } from "react"
import { useTranslation } from "react-i18next"
import { DoubtIcon } from "@illa-public/icon"
import { CREDIT_UNIT_BY_CYCLE } from "@illa-public/upgrade-modal"
import { infoTitleStyle } from "@/page/SettingPage/team/billing/style"
import { toThousands } from "@/utils/billing/toThousands"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { BillingContext } from "../../context"
import {
  cardDetailContainerStyle,
  cardPayDetailItemStyle,
  cardPayDetailNameStyle,
  cardPayDetailNumStyle,
  cardPayDetailStyle,
  cardStyle,
  cardTitleStyle,
  collarCardNameStyle,
  doubtColorStyle,
  licenseCardContainerStyle,
  payInfoCancelStyle,
  payInfoExpiredStyle,
  teamInfoStyle,
} from "./style"

const CreditCard: FC = () => {
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!
  const titleRef = useRef<HTMLSpanElement>(null)
  const {
    creditInfo,
    isCancelSubscribedCredit,
    isExpiredCredit,
    isUnSubscribeCredit,
    openCreditDrawer,
  } = useContext(BillingContext)

  const creditNum =
    (creditInfo?.quantity ?? 0) * CREDIT_UNIT_BY_CYCLE[creditInfo?.cycle] * 1000

  return (
    <section css={licenseCardContainerStyle} id="license">
      <span css={infoTitleStyle}>{t("billing.menu.overview")}</span>
      <div css={teamInfoStyle}>
        <img src={teamInfo?.icon} />
        <span>{teamInfo?.name}</span>
      </div>
      <div css={cardDetailContainerStyle}>
        <div css={cardStyle}>
          <div css={cardTitleStyle}>
            <div css={collarCardNameStyle}>
              <span>Credit</span>
              <Tooltip trigger="hover" title={t("tipi_billing.credits_desc")}>
                <span css={doubtColorStyle} ref={titleRef}>
                  <Icon component={DoubtIcon} />
                </span>
              </Tooltip>
            </div>
            {!isExpiredCredit &&
              !isUnSubscribeCredit &&
              !isCancelSubscribedCredit && (
                <Button onClick={openCreditDrawer}>
                  {t("tipi_billing.manage_credits")}
                </Button>
              )}

            {isExpiredCredit && (
              <span css={payInfoExpiredStyle}>
                {t("billing.label.expired")}
              </span>
            )}
            {isCancelSubscribedCredit && (
              <span css={payInfoCancelStyle}>
                {t("billing.label.canceled")}
              </span>
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
                  ? t(
                      "billing.subscription_general.table_title.expiration_date",
                    )
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
                    {t("tipi_billing.subscribed_credits")}
                  </span>
                  <span css={cardPayDetailNumStyle}>
                    {toThousands(creditNum || 0)}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreditCard
