import { isObject } from "lodash-es"

export const templateSubstituteDynamicValues = (
  dynamicString: string,
  stringSnippets: string[],
  values: unknown[],
): string => {
  let finalValue = dynamicString
  stringSnippets.forEach((b, i) => {
    let value = values[i]
    if (Array.isArray(value) || isObject(value)) {
      value = JSON.stringify(value)
    }
    try {
      if (typeof value === "string" && JSON.parse(value)) {
        value = value.replace(/\\([\s\S])|(")/g, "\\$1$2")
      }
    } catch (e) {
      // do nothing
    }
    finalValue = finalValue.replace(b, `${value}`)
  })
  return finalValue
}
