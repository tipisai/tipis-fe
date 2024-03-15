import { RESULT_TYPES } from "./interface"

export const fixedValue = (value: unknown) => {
  if (value == undefined) return ""
  if (typeof value === "string") return value
  return `{{${JSON.stringify(value)}}}`
}

export const getResultType = (result: unknown) => {
  if (Array.isArray(result)) {
    return RESULT_TYPES.ARRAY
  } else if (typeof result === "string") {
    return RESULT_TYPES.STRING
  } else if (typeof result === "number") {
    return RESULT_TYPES.NUMBER
  } else if (typeof result === "boolean") {
    return RESULT_TYPES.BOOLEAN
  } else if (typeof result === "undefined") {
    return RESULT_TYPES.UNDEFINED
  } else if (result === null) {
    return RESULT_TYPES.NULL
  } else {
    return RESULT_TYPES.OBJECT
  }
}

export const transResultToResultType = (type: RESULT_TYPES, value: string) => {
  switch (type) {
    case RESULT_TYPES.ARRAY:
      return Array.isArray(value) ? value : JSON.parse(value)
    case RESULT_TYPES.STRING:
      return value
    case RESULT_TYPES.NUMBER:
      return Number(value)
    case RESULT_TYPES.BOOLEAN:
      return Boolean(value)
    case RESULT_TYPES.UNDEFINED:
      return undefined
    case RESULT_TYPES.NULL:
      return null
    case RESULT_TYPES.OBJECT:
      return typeof value === "object" ? value : JSON.parse(value)
    default:
      return value
  }
}
