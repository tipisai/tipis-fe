import dayjs from "dayjs"
import { IScheduleOptions, SCHEDULE_TYPES } from "@illa-public/public-types"
import {
  DAY_OF_MONTH_OPTIONS,
  DAY_OF_WEEK_OPTIONS,
  MONTH_OPTIONS,
} from "@/config/constants/schedule"
import i18n from "@/i18n"

export const getFormatTime = (hour: number = 0, minute: number = 0) => {
  const times = `${hour}:${minute}`
  return dayjs(times, "HH:mm").format("HH:mm")
}

export const getOptionDetail = (
  type: SCHEDULE_TYPES,
  options: IScheduleOptions,
) => {
  const atStr = i18n.t("flow.editor.trigger.schedule.at")
  const onStr = i18n.t("flow.editor.trigger.schedule.on")
  let detail = ""
  switch (type) {
    case SCHEDULE_TYPES.EVERY_HOUR: {
      const time = dayjs(`${options.minute}`, "mm").format("mm")
      detail = `${time}, ${i18n.t("flow.editor.trigger.schedule.every_hour")}`
      break
    }
    case SCHEDULE_TYPES.EVERY_DAY: {
      const time = getFormatTime(options.hour, options.minute)
      detail = `${time}, ${i18n.t("flow.editor.trigger.schedule.every_day")}`
      break
    }
    case SCHEDULE_TYPES.EVERY_WEEK: {
      const time = getFormatTime(options.hour, options.minute)
      const weekday = DAY_OF_WEEK_OPTIONS.find(
        (item) => item.value === options.weekday,
      )?.label

      detail = `${time}, ${weekday ? `${onStr} ${weekday}, ` : ""}${i18n.t("flow.editor.trigger.schedule.every_week")}`
      break
    }
    case SCHEDULE_TYPES.EVERY_MONTH: {
      const time = getFormatTime(options.hour, options.minute)
      const dayOfMonth = DAY_OF_MONTH_OPTIONS.find(
        (item) => item.value === options.dayOfMonth,
      )?.label

      detail = `${time}, ${dayOfMonth ? `${onStr} ${dayOfMonth}, ` : ""}${i18n.t("flow.editor.trigger.schedule.every_mont")}`
      break
    }
    case SCHEDULE_TYPES.EVERY_YEAR: {
      const time = getFormatTime(options.hour, options.minute)
      const dayOfMonth = DAY_OF_MONTH_OPTIONS.find(
        (item) => item.value === options.dayOfMonth,
      )?.label

      const monthOfYear = MONTH_OPTIONS.find(
        (item) => item.value === options.month,
      )?.label

      detail = `${time}, ${monthOfYear ? `${onStr} ${dayOfMonth} ${monthOfYear}, ` : ""}${i18n.t("flow.editor.trigger.schedule.every_mont")}`
      break
    }
  }
  return `${atStr} ${detail}`
}
