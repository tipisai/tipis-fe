import { FC } from "react"
import { useTranslation } from "react-i18next"
import {
  emptyContainerStyle,
  emptyNumStyle,
  emptyStyle,
  emptyUsedStyle,
} from "./style"

export const EmptyUsage: FC = () => {
  const { t } = useTranslation()
  return (
    <div css={emptyContainerStyle}>
      <div css={emptyStyle}>
        <span css={emptyNumStyle}>0</span>
        <span css={emptyUsedStyle}>{t("tipi_billing.used")}</span>
      </div>
    </div>
  )
}
