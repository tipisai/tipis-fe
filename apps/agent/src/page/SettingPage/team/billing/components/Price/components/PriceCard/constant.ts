import { SUBSCRIPTION_CYCLE } from "@illa-public/public-types"
import {
  CREDIT_UNIT_BY_CYCLE,
  UNIT_CREDIT_CONVERSION_FUNCTION_NUM,
  UNIT_CREDIT_CONVERSION_TOKEN,
} from "@illa-public/upgrade-modal"
import i18n from "@/i18n"
import { toThousands } from "@/utils/billing/toThousands"

export const CREDIT_LIST = [
  {
    label: i18n.t("tipi_billing.text_generation"),
    desc: i18n.t("tipi_billing.text_generation_num", {
      tokenUnit: toThousands(
        UNIT_CREDIT_CONVERSION_TOKEN *
          CREDIT_UNIT_BY_CYCLE[SUBSCRIPTION_CYCLE.MONTHLY],
      ),
      creditUnit: toThousands(CREDIT_UNIT_BY_CYCLE[SUBSCRIPTION_CYCLE.MONTHLY]),
    }),
  },
  {
    label: i18n.t("tipi_billing.function_execution"),
    desc: i18n.t("tipi_billing.function_execution_num", {
      functionNum: toThousands(
        UNIT_CREDIT_CONVERSION_FUNCTION_NUM *
          CREDIT_UNIT_BY_CYCLE[SUBSCRIPTION_CYCLE.MONTHLY],
      ),
      creditUnit: toThousands(CREDIT_UNIT_BY_CYCLE[SUBSCRIPTION_CYCLE.MONTHLY]),
    }),
  },
]
