import { DatePicker } from "antd"
import {
  Chart as ChartJS,
  ChartOptions,
  DoughnutController,
  Title,
  Tooltip,
} from "chart.js"
import dayjs, { Dayjs } from "dayjs"
import { FC, useContext, useRef } from "react"
import { Doughnut } from "react-chartjs-2"
import { useTranslation } from "react-i18next"
import FullSectionLoading from "@/components/FullSectionLoading"
import { infoTitleStyle } from "@/page/SettingPage/team/billing/style"
import { toThousands } from "@/utils/billing/toThousands"
import { EmptyUsage } from "../components/EmptyUsage"
import { Legend } from "../components/Legend"
import { UsageContext } from "../context"
import { DoughnutPlugin } from "../doughnutPlugin"
import {
  cardContainerStyle,
  collarUsageContainerStyle,
  collarUsageHeaderStyle,
  detailStyle,
  doughnutContainerStyle,
  loadingContainerStyle,
} from "./style"

ChartJS.register(DoughnutController, DoughnutPlugin, Title, Tooltip)

const { MonthPicker } = DatePicker

export const CreditUsagePC: FC = () => {
  const { t } = useTranslation()

  const { usageData, percentNum, handleDateChange, allNum, loading, dataNums } =
    useContext(UsageContext)

  const date = useRef(new Date())
  const getDisabledDate = (current: Dayjs) => {
    if (current.year() === date.current.getFullYear()) {
      return current.month() > date.current.getMonth()
    } else {
      return current.year() > date.current.getFullYear()
    }
  }

  const options = {
    plugins: {
      doughnutPlugin: {
        total: toThousands(allNum),
        title: t("tipi_billing.used"),
      },
    },
  }
  return (
    <section css={collarUsageContainerStyle} id="colla-usage">
      <div css={collarUsageHeaderStyle}>
        <span css={infoTitleStyle}>{t("tipi_billing.credit_usage")}</span>
        <MonthPicker
          allowClear={false}
          defaultValue={dayjs(date.current) as unknown as string}
          disabledDate={getDisabledDate}
          onChange={handleDateChange}
        />
      </div>
      <div css={cardContainerStyle}>
        {loading ? (
          <div css={loadingContainerStyle}>
            <FullSectionLoading />
          </div>
        ) : (
          <div css={detailStyle}>
            {allNum !== 0 ? (
              <div css={doughnutContainerStyle}>
                <Doughnut
                  datasetIdKey="id"
                  data={usageData}
                  options={options as ChartOptions<"doughnut">}
                />
              </div>
            ) : (
              <EmptyUsage />
            )}
            <Legend dataNums={dataNums} percentNum={percentNum} />
          </div>
        )}
      </div>
    </section>
  )
}
