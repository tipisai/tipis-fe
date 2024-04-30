import { IScheduleOptions } from "@illa-public/public-types"

export interface IScheduleRuleProps {
  options: IScheduleOptions
  handleUpdateIScheduleOptions: (value: IScheduleOptions) => void
  enabled: boolean
}
