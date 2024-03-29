import { FC } from "react"
import { useTranslation } from "react-i18next"
import { LABEL_CONFIG } from "@/page/SettingPage/team/billing/components/WooUsage/constants"
import { toThousands } from "@/utils/billing/toThousands"
import {
  itemContainerStyle,
  itemNameStyle,
  itemPercentStyle,
  itemUnitContainerStyle,
  itemUsedStyle,
  legendContainerStyle,
  legendItemContainerStyle,
  legendPointStyle,
} from "./style"

interface LegendProps {
  percentNum: number[]
  dataNums: number[]
}

export const Legend: FC<LegendProps> = ({ dataNums, percentNum }) => {
  const { t } = useTranslation()
  return (
    <div css={legendContainerStyle}>
      {dataNums.map((item, i) => (
        <div key={i} css={legendItemContainerStyle}>
          <div css={itemContainerStyle}>
            <div css={legendPointStyle(LABEL_CONFIG.COLOR[i])} />
            <span css={itemNameStyle}>{t(LABEL_CONFIG.NAME[i])}</span>
          </div>
          <div css={itemUnitContainerStyle}>
            <span css={itemUsedStyle}>{toThousands(item)}</span>
            <span css={itemPercentStyle}>{`(${percentNum[i]}%)`}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
