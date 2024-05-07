import { InputNumber } from "antd"
import { FC, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { SCHEDULE_TYPES } from "@illa-public/public-types"
import { IntervalSetterProps } from "./interface"
import { intervalContainerStyle, labelStyle } from "./style"

const IntervalSetter: FC<IntervalSetterProps> = (props) => {
  const { scheduleType, interval, handleUpdateIScheduleOptions, enabled } =
    props
  const { t } = useTranslation()
  const suffix = useMemo(() => {
    switch (scheduleType) {
      case SCHEDULE_TYPES.EVERY_YEAR:
        return t("flow.editor.trigger.schedule.year_plural")
      case SCHEDULE_TYPES.EVERY_MONTH:
        return t("flow.editor.trigger.schedule.month_plural")
      case SCHEDULE_TYPES.EVERY_WEEK:
        return t("flow.editor.trigger.schedule.week_plural")
      case SCHEDULE_TYPES.EVERY_DAY:
        return t("flow.editor.trigger.schedule.day_plural")
      case SCHEDULE_TYPES.EVERY_HOUR:
        return t("flow.editor.trigger.schedule.hour_plural")
    }
  }, [scheduleType, t])
  return (
    <div css={intervalContainerStyle(enabled)}>
      <span css={labelStyle}>{t("flow.editor.trigger.schedule.every")}</span>
      <InputNumber
        style={{
          width: "100%",
        }}
        value={interval}
        min={1}
        onChange={(v) => {
          v !== null && handleUpdateIScheduleOptions({ interval: v })
        }}
        disabled={!enabled}
      />
      <span css={labelStyle}>{suffix}</span>
    </div>
  )
}

export default IntervalSetter
