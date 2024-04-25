import { ComponentType } from "react"
import { SCHEDULE_TYPES } from "@illa-public/public-types"
import DaySchedule from "./DaySchedule"
import HoverSchedule from "./HourSchedule"
import MonthSchedule from "./MonthSchedule"
import WeekSchedule from "./WeekSchedule"
import YearSchedule from "./YearSchedule"
import { IScheduleRuleProps } from "./interface"

export const SCHEDULE_TYPE_MAP_SETTER: Record<
  SCHEDULE_TYPES,
  ComponentType<IScheduleRuleProps>
> = {
  [SCHEDULE_TYPES.EVERY_DAY]: DaySchedule,
  [SCHEDULE_TYPES.EVERY_HOUR]: HoverSchedule,
  [SCHEDULE_TYPES.EVERY_MONTH]: MonthSchedule,
  [SCHEDULE_TYPES.EVERY_WEEK]: WeekSchedule,
  [SCHEDULE_TYPES.EVERY_YEAR]: YearSchedule,
}
