import {
  Completion,
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete"
import { CompletionsQuery, Server } from "tern"
import { CompletionsQueryResult } from "tern/lib/tern"
import { CODE_TYPE } from "@/components/CodeEditor/CodeMirror/extensions/interface"
import { checkCursorInDynamicFlag } from "../util"
import ecmaScript from "./defs/ecmascript.json"

// @ts-ignore
const server = new Server({ defs: [ecmaScript] })

export enum AutocompleteDataType {
  OBJECT = "Object",
  NUMBER = "Number",
  ARRAY = "Array",
  FUNCTION = "Function",
  BOOLEAN = "Boolean",
  STRING = "String",
  UNKNOWN = "Unknown",
}

export function getDataType(type: string): AutocompleteDataType {
  if (type === "?") return AutocompleteDataType.UNKNOWN
  else if (type === "number") return AutocompleteDataType.NUMBER
  else if (type === "string") return AutocompleteDataType.STRING
  else if (type === "bool") return AutocompleteDataType.BOOLEAN
  else if (type === "array") return AutocompleteDataType.ARRAY
  else if (/^\[/.test(type)) return AutocompleteDataType.ARRAY
  else if (/^fn\(/.test(type)) return AutocompleteDataType.FUNCTION
  else return AutocompleteDataType.UNKNOWN
}

export const ternSeverCompletionSource = (
  codeType: CODE_TYPE,
): ((
  context: CompletionContext,
) => CompletionResult | Promise<CompletionResult | null> | null) => {
  const isFunction =
    codeType === CODE_TYPE.FUNCTION ||
    codeType === CODE_TYPE.EXPRESSION_WITHOUT_TEMPLATE
  return (context: CompletionContext) => {
    const isCursorInDynamicFlag = isFunction
      ? true
      : checkCursorInDynamicFlag(context)
    if (!isCursorInDynamicFlag) {
      return null
    }
    if (
      context.matchBefore(/\w[\w\.]*/) === null &&
      (isFunction || context.matchBefore(/\{\{\s*/) === null)
    ) {
      return null
    }
    const pos = context.pos
    const query: CompletionsQuery = {
      type: "completions",
      types: true,
      docs: true,
      urls: true,
      origins: true,
      caseInsensitive: true,
      guess: false,
      inLiteral: false,
      includeKeywords: true,
      end: pos,
      file: "#0",
    }
    const files = [
      // @ts-ignore maybe this is a ternjs type error
      {
        type: "full",
        name: "_temp",
        text: context.state.sliceDoc(),
      },
    ]

    const request = { query, files }
    let error: string | null = null

    // @ts-ignore maybe this is a ternjs type error
    let result: any

    server.request(
      // @ts-ignore maybe this is a ternjs type error
      request,
      (ternError, response) => {
        error = ternError
        if (response) {
          result = response as CompletionsQueryResult
        }
      },
    )

    if (error || !result || result.completions.length === 0) {
      return null
    }
    const options: Completion[] = []
    const completions = result.completions as Array<{
      name: string
      type?: string | undefined
      depth?: number | undefined
      doc?: string | undefined
      url?: string | undefined
      origin?: string | undefined
    }>
    completions.forEach((completion) => {
      const dataType = getDataType(completion?.type || "?")
      const completionOption: Completion = {
        type: dataType,
        label: completion.name,
        detail: dataType,
        boost: -1,
      }
      options.push(completionOption)
    })

    return {
      from: result.start,
      validFor: /^\w*$/,
      options,
    }
  }
}
