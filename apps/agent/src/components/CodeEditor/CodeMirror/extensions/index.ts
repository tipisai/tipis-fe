import {
  acceptCompletion,
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  closeCompletion,
  moveCompletionSelection,
} from "@codemirror/autocomplete"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { sql } from "@codemirror/lang-sql"
import { bracketMatching, indentOnInput } from "@codemirror/language"
import { Extension, Prec } from "@codemirror/state"
import { dropCursor, keymap, lineNumbers, tooltips } from "@codemirror/view"
import { useCallback, useMemo } from "react"
import { buildCompletionSources } from "./completionSources/buildSources"
import { getHighlightExpressionExtension } from "./heighLightJSExpression"
import { highlightSyntaxExtension } from "./highLightSyntax"
import { CODE_LANG, CODE_TYPE, ICodeMirrorOptions } from "./interface"

export const basicExtension: Extension = [
  history(),
  dropCursor(),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
]

const keyMapExtensions = Prec.highest(
  keymap.of([
    { key: "Escape", run: closeCompletion },
    { key: "ArrowDown", run: moveCompletionSelection(true) },
    { key: "ArrowUp", run: moveCompletionSelection(false) },
    { key: "PageDown", run: moveCompletionSelection(true, "page") },
    { key: "PageUp", run: moveCompletionSelection(false, "page") },
    { key: "Tab", run: acceptCompletion },
    { key: "Enter", run: acceptCompletion },
  ]),
)

const getAutoCompletionExtension = (
  codeType: CODE_TYPE,
  lang: CODE_LANG,
  sqlScheme: Record<string, unknown>,
  completionOptions: Record<string, unknown>,
) => {
  const completionSources = buildCompletionSources(
    codeType,
    lang,
    sqlScheme,
    completionOptions,
  )
  return [
    autocompletion({
      override: completionSources,
      defaultKeymap: false,
      closeOnBlur: false,
    }),
    keyMapExtensions,
  ]
}

export const useBasicSetup = (options: ICodeMirrorOptions) => {
  const {
    showLineNumbers,
    expressions = [],
    completionOptions,
    lang = CODE_LANG.JAVASCRIPT,
    codeType = CODE_TYPE.EXPRESSION,
    sqlScheme = {},
    autoCompleteTipContainer,
  } = options

  const autocompletionExtension = useMemo(
    () =>
      getAutoCompletionExtension(codeType, lang, sqlScheme, completionOptions),
    [codeType, completionOptions, lang, sqlScheme],
  )

  const showLinNUmberExtension = useMemo(
    () => (showLineNumbers ? [lineNumbers()] : []),
    [showLineNumbers],
  )

  const highlightJSExpressionExtension = useMemo(() => {
    const isFunction = codeType === CODE_TYPE.FUNCTION
    return isFunction ? [] : getHighlightExpressionExtension(expressions)
  }, [codeType, expressions])

  const langExtension = useMemo(() => {
    const plugins: Extension[] = [
      // syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      highlightSyntaxExtension(lang, codeType),
    ]
    switch (lang) {
      case CODE_LANG.PGSQL:
      case CODE_LANG.MARIASQL:
      case CODE_LANG.MSSQL:
      case CODE_LANG.SQLite:
      case CODE_LANG.CASSANDRA:
      case CODE_LANG.PLSQL:
      case CODE_LANG.MYSQL:
      case CODE_LANG.SQL: {
        plugins.push(
          sql({
            upperCaseKeywords: true,
          }),
        )
        break
      }
      case CODE_LANG.JAVASCRIPT:
      default: {
        plugins.push(javascript())
        break
      }
    }
    return plugins
  }, [codeType, lang])

  const buildTooltipExtension = useCallback(
    (autoCompleteTipContainer?: HTMLElement) => {
      return tooltips({
        position: "fixed",
        parent:
          autoCompleteTipContainer ||
          document.querySelector<HTMLElement>(".illaCodeMirrorWrapper") ||
          document.body,
      })
    },
    [],
  )

  const tooltipExtension = useMemo(() => {
    return buildTooltipExtension(autoCompleteTipContainer)
  }, [autoCompleteTipContainer, buildTooltipExtension])

  const extensions = useMemo(
    () => [
      basicExtension,
      autocompletionExtension,
      highlightJSExpressionExtension,
      showLinNUmberExtension,
      langExtension,
      tooltipExtension,
    ],
    [
      autocompletionExtension,
      highlightJSExpressionExtension,
      langExtension,
      showLinNUmberExtension,
      tooltipExtension,
    ],
  )

  return extensions
}
