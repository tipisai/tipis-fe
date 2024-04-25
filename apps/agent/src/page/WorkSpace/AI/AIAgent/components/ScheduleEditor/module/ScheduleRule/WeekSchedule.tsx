import { Select, TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { DAY_OF_WEEK, SCHEDULE_TYPES } from "@illa-public/public-types"
import RowContainer from "../../components/RowContainer"
import IntervalSetter from "../IntervalSetter"
import { DAY_OF_WEEK_OPTIONS } from "./config"
import { IScheduleRuleProps } from "./interface"

const WeekScheduleSetter: FC<IScheduleRuleProps> = (props) => {
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
          value={options.weekday}
          style={{
            width: 206,
          }}
          options={DAY_OF_WEEK_OPTIONS}
          onChange={(v) => {
            handleUpdateIScheduleOptions({
              weekday: v as DAY_OF_WEEK,
            })
          }}
          disabled={!enabled}
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
          showNow={false}
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
          scheduleType={SCHEDULE_TYPES.EVERY_WEEK}
          interval={options.interval}
          handleUpdateIScheduleOptions={handleUpdateIScheduleOptions}
          enabled={enabled}
        />
      </RowContainer>
    </>
  )
}

export default WeekScheduleSetter
