import { IScheduleOptions, SCHEDULE_TYPES } from "@illa-public/public-types"

export interface IntervalSetterProps {
  scheduleType: SCHEDULE_TYPES
  interval: number | undefined
  handleUpdateIScheduleOptions: (value: IScheduleOptions) => void
  enabled: boolean
}
