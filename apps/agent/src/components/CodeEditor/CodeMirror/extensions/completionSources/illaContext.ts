import {
  Completion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete"
import { EditorView } from "@codemirror/view"
import { capitalize } from "lodash-es"
import sanbox from "@/utils/sanbox"
import { CODE_TYPE } from "../interface"
import { checkCursorInDynamicFlag, getDataType } from "./util"

export const getDataInfo = (data: Record<string, unknown>, path: string) => {
  const pos = path.lastIndexOf(".")
  if (pos < 0) {
    return [data, 0, path]
  }
  try {
    const value = sanbox.evaluateExpression(path.slice(0, pos), data)
    if (typeof value === "object" && value && !Array.isArray(value)) {
      return [value, pos + 1, path.slice(pos + 1)]
    }
  } catch (e) {
    return
  }
}

export const buildILLAContextCompletionSource = (
  completeOptions: Record<string, unknown>,
  codeType: CODE_TYPE,
): ((
  context: CompletionContext,
) => CompletionResult | Promise<CompletionResult | null> | null) => {
  return (context: CompletionContext) => {
    const isFunction =
      codeType === CODE_TYPE.FUNCTION ||
      codeType === CODE_TYPE.EXPRESSION_WITHOUT_TEMPLATE
    const isCursorInDynamicFlag = isFunction
      ? true
      : checkCursorInDynamicFlag(context)
    if (!isCursorInDynamicFlag) {
      return null
    }
    const matchPath = context.matchBefore(
      /(?:[A-Za-z_$][\w$]*(?:\[\s*(?:\d+|(["'])(?:[^\1\\]|\\.)*?\1)\s*\])*\.)*(?:[A-Za-z_$][\w$]*)?/,
    )
    if (!matchPath) {
      return null
    }

    if (
      matchPath.text.length === 0 &&
      (isFunction || context.matchBefore(/\{\{\s*/) === null)
    ) {
      return null
    }

    const info = getDataInfo(completeOptions, matchPath.text)
    if (!info) {
      return null
    }
    const [currentData, offset, prefix] = info
    const keys = Object.keys(currentData).filter((key) =>
      key.startsWith(prefix),
    )

    const options = keys.map((key) => {
      const dataType = getDataType(currentData[key])
      const result: Completion = {
        type: dataType,
        label: key,
        detail: capitalize(dataType),
        boost: 1,
        apply:
          offset === 0
            ? undefined
            : (view: EditorView, c: Completion, from: number, to: number) => {
                view.dispatch({
                  changes: {
                    from: from - 1,
                    to: to,
                    insert: key.match(/^[A-Za-z_$][\w$]*$/)
                      ? `.${key}`
                      : `['${key.replace(/[\\']/g, (c) => "\\" + c)}']`,
                  },
                })
              },
      }
      return result
    })
    const completions = {
      from: matchPath.from + offset,
      validFor: /^\w*$/,
      options: options,
    }
    return completions
  }
}
