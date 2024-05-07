import {
  DAY_OF_WEEK,
  IScheduleOptions,
  SCHEDULE_TYPES,
} from "@illa-public/public-types"

export const getInitScheduleOptions = (
  type: SCHEDULE_TYPES,
): IScheduleOptions => {
  switch (type) {
    case SCHEDULE_TYPES.EVERY_YEAR: {
      return {
        month: 1,
        dayOfMonth: "1",
        hour: 0,
        minute: 0,
        interval: 1,
      }
    }
    case SCHEDULE_TYPES.EVERY_MONTH: {
      return {
        dayOfMonth: "1",
        hour: 0,
        minute: 0,
        interval: 1,
      }
    }
    case SCHEDULE_TYPES.EVERY_WEEK: {
      return {
        weekday: DAY_OF_WEEK.MONDAY,
        hour: 0,
        minute: 0,
        interval: 1,
      }
    }
    case SCHEDULE_TYPES.EVERY_DAY: {
      return {
        hour: 0,
        minute: 0,
        interval: 1,
      }
    }
    case SCHEDULE_TYPES.EVERY_HOUR: {
      return {
        minute: 0,
        interval: 1,
      }
    }
  }
}
