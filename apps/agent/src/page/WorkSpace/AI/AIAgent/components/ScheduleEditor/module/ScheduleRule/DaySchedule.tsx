import { TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { SCHEDULE_TYPES } from "@illa-public/public-types"
import RowContainer from "../../components/RowContainer"
import IntervalSetter from "../IntervalSetter"
import { IScheduleRuleProps } from "./interface"

const DayScheduleSetter: FC<IScheduleRuleProps> = (props) => {
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
          scheduleType={SCHEDULE_TYPES.EVERY_DAY}
          interval={options.interval}
          handleUpdateIScheduleOptions={handleUpdateIScheduleOptions}
          enabled={enabled}
        />
      </RowContainer>
    </>
  )
}

export default DayScheduleSetter
