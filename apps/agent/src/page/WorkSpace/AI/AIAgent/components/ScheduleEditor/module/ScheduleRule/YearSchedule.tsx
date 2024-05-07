import { Select, TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { SCHEDULE_TYPES } from "@illa-public/public-types"
import { DATE_OPTIONS_MAP, MONTH_OPTIONS } from "@/config/constants/schedule"
import RowContainer from "../../components/RowContainer"
import IntervalSetter from "../IntervalSetter"
import { IScheduleRuleProps } from "./interface"

const YearScheduleSetter: FC<IScheduleRuleProps> = (props) => {
  const { options, handleUpdateIScheduleOptions, enabled } = props
  const { t } = useTranslation()

  const times = `${options.hour}:${options.minute}`

  const handleChange = (v: Dayjs) => {
    if (!v) {
      handleUpdateIScheduleOptions({
        hour: 0,
        minute: 0,
      })
    } else {
      handleUpdateIScheduleOptions({
        hour: v.get("hour"),
        minute: v.get("minute"),
      })
    }
  }

  return (
    <>
      <RowContainer
        labelName={t("flow.editor.trigger.schedule.on")}
        enabled={enabled}
      >
        <Select
          value={options.month}
          style={{
            width: 206,
          }}
          options={MONTH_OPTIONS}
          onChange={(v) => {
            handleUpdateIScheduleOptions({
              month: v as number,
              dayOfMonth: "1",
            })
          }}
        />
      </RowContainer>

      <RowContainer labelName=" " enabled={enabled}>
        <Select
          value={options.dayOfMonth}
          style={{
            width: 206,
          }}
          options={options.month ? DATE_OPTIONS_MAP[options.month] : []}
          onChange={(v) => {
            handleUpdateIScheduleOptions({ dayOfMonth: v })
          }}
        />
      </RowContainer>

      <RowContainer
        labelName={t("flow.editor.trigger.schedule.at")}
        enabled={enabled}
      >
        <TimePicker
          style={{
            width: 206,
          }}
          format="HH:mm"
          value={dayjs(times, "HH:mm")}
          onChange={handleChange}
          disabled={!enabled}
        />
      </RowContainer>
      <RowContainer
        labelName={t("flow.editor.trigger.schedule.interval")}
        enabled={enabled}
      >
        <IntervalSetter
          scheduleType={SCHEDULE_TYPES.EVERY_YEAR}
          interval={options.interval}
          handleUpdateIScheduleOptions={handleUpdateIScheduleOptions}
          enabled={enabled}
        />
      </RowContainer>
    </>
  )
}

export default YearScheduleSetter
