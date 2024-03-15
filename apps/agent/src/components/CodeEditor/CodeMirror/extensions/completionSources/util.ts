import { CompletionContext } from "@codemirror/autocomplete"
import { getStringSnippets } from "@illa-public/dynamic-string"
import { AutocompleteDataType } from "./TernServer"

export function getDataType(data: unknown): AutocompleteDataType {
  const type = typeof data
  if (type === "number") return AutocompleteDataType.NUMBER
  else if (type === "string") return AutocompleteDataType.STRING
  else if (type === "boolean") return AutocompleteDataType.BOOLEAN
  else if (Array.isArray(data)) return AutocompleteDataType.ARRAY
  else if (type === "function") return AutocompleteDataType.FUNCTION
  else if (type === "undefined") return AutocompleteDataType.UNKNOWN
  return AutocompleteDataType.OBJECT
}

export function checkCursorInDynamicFlag(context: CompletionContext): boolean {
  const { state, pos } = context
  const doc = state.sliceDoc(0, pos)
  const stringSnippets = getStringSnippets(doc)
  let nextDynamicStringStartIndex = 0
  for (let i = 0; i < stringSnippets.length; i++) {
    const snippet = stringSnippets[i]
    const start = nextDynamicStringStartIndex
    const dynamicStringStartIndex = snippet.indexOf("{{")
    const stringStartIndex = dynamicStringStartIndex + start + 2
    const dynamicStringEndIndex = snippet.indexOf("}}")
    const stringEndIndex = dynamicStringEndIndex + start
    if (
      dynamicStringStartIndex > -1 &&
      stringStartIndex <= pos &&
      (dynamicStringEndIndex <= -1 || pos <= stringEndIndex)
    ) {
      return true
    }
    nextDynamicStringStartIndex += snippet.length
  }
  return false
}
