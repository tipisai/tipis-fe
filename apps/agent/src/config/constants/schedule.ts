import i18next from "i18next"
import { DAY_OF_WEEK } from "@illa-public/public-types"

export const MONTH_OPTIONS = [
  {
    label: i18next.t("flow.editor.trigger.schedule.jan"),
    value: 1,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.feb"),
    value: 2,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.mar"),
    value: 3,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.apr"),
    value: 4,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.may"),
    value: 5,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.jun"),
    value: 6,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.jul"),
    value: 7,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.aug"),
    value: 8,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.sep"),
    value: 9,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.oct"),
    value: 10,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.nov"),
    value: 11,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.dec"),
    value: 12,
  },
]

export const BASE_DAY_OF_MONTH_OPTIONS = [
  {
    label: i18next.t(`flow.editor.trigger.schedule.1st`),
    value: "1",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.2nd`),
    value: "2",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.3rd`),
    value: "3",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.4th`),
    value: "4",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.5th`),
    value: "5",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.6th`),
    value: "6",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.7th`),
    value: "7",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.8th`),
    value: "8",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.9th`),
    value: "9",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.10th`),
    value: "10",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.11th`),
    value: "11",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.12th`),
    value: "12",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.13th`),
    value: "13",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.14th`),
    value: "14",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.15th`),
    value: "15",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.16th`),
    value: "16",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.17th`),
    value: "17",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.18th`),
    value: "18",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.19th`),
    value: "19",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.20th`),
    value: "20",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.21st`),
    value: "21",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.22nd`),
    value: "22",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.23rd`),
    value: "23",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.24th`),
    value: "24",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.25th`),
    value: "25",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.26th`),
    value: "26",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.27th`),
    value: "27",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.28th`),
    value: "28",
  },
  {
    label: i18next.t(`flow.editor.trigger.schedule.29th`),
    value: "29",
  },
]

export const DAY_OF_MONTH_OPTIONS = [
  ...BASE_DAY_OF_MONTH_OPTIONS,
  {
    label: i18next.t("flow.editor.trigger.schedule.30th"),
    value: "30",
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.31st"),
    value: "31",
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.last_day_o"),
    value: "lastDay",
  },
]

export const DAY_OF_WEEK_OPTIONS = [
  {
    label: i18next.t("flow.editor.trigger.schedule.monday"),
    value: DAY_OF_WEEK.MONDAY,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.tuesday"),
    value: DAY_OF_WEEK.TUESDAY,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.wednesday"),
    value: DAY_OF_WEEK.WEDNESDAY,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.thursday"),
    value: DAY_OF_WEEK.THURSDAY,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.friday"),
    value: DAY_OF_WEEK.FRIDAY,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.saturday"),
    value: DAY_OF_WEEK.SATURDAY,
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.sunday"),
    value: DAY_OF_WEEK.SUNDAY,
  },
]

export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => ({
  label: `${i}`,
  value: i,
}))

const JAN_DAYS = [
  ...BASE_DAY_OF_MONTH_OPTIONS,
  {
    label: i18next.t("flow.editor.trigger.schedule.30th"),
    value: "30",
  },
  {
    label: i18next.t("flow.editor.trigger.schedule.31st"),
    value: "31",
  },
]

const FEB_DAYS = [
  ...BASE_DAY_OF_MONTH_OPTIONS,
  {
    label: i18next.t("flow.editor.trigger.schedule.last_day_feb"),
    value: "lastDay",
  },
]

const APR_DAYS = [
  ...BASE_DAY_OF_MONTH_OPTIONS,
  {
    label: i18next.t("flow.editor.trigger.schedule.30th"),
    value: "30",
  },
]

export const DATE_OPTIONS_MAP: Record<
  number,
  { label: string; value: string }[]
> = {
  [1]: JAN_DAYS,
  [2]: FEB_DAYS,
  [3]: JAN_DAYS,
  [4]: APR_DAYS,
  [5]: JAN_DAYS,
  [6]: APR_DAYS,
  [7]: JAN_DAYS,
  [8]: JAN_DAYS,
  [9]: APR_DAYS,
  [10]: JAN_DAYS,
  [11]: APR_DAYS,
  [12]: JAN_DAYS,
}
