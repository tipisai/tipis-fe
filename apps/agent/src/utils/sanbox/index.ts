import { getSnippets } from "@illa-public/dynamic-string/converter"
import { RESULT_TYPES } from "@/components/CodeEditor/CodeMirror/interface"
import { getResultType } from "@/components/CodeEditor/CodeMirror/utils"
import { templateSubstituteDynamicValues } from "./utils"

type SandboxContext = Record<string, unknown>
type ExpressionResult = { value: string; hasError: boolean }

class Sandbox {
  formatValue = (value: unknown) => {
    switch (getResultType(value)) {
      case RESULT_TYPES.NUMBER:
      case RESULT_TYPES.STRING:
        return value as string
      case RESULT_TYPES.UNDEFINED:
        return "undefined"
      case RESULT_TYPES.NULL:
        return "null"
      case RESULT_TYPES.BOOLEAN:
        return `${value}` as string
      case RESULT_TYPES.ARRAY:
      case RESULT_TYPES.OBJECT:
        return JSON.stringify(value, null)
    }
  }
  evaluateExpression = (jsCode: string, context: SandboxContext) => {
    try {
      const proxyContext = new Proxy(context, {
        get: (target, prop) => {
          if (prop === "window") {
            throw new Error("Access to window is not allowed")
          }
          return Reflect.get(target, prop) ?? Reflect.get(globalThis, prop)
        },
      })

      const func = new Function(
        "context",
        `with (context) { return ${jsCode}; }`,
      )
      return func(proxyContext)
    } catch (error) {
      throw new Error(
        `Error in expression ${jsCode}: ${(error as Error).message}`,
      )
    }
  }

  getDynamicValue = (originCode: string, context: SandboxContext) => {
    const { jsSnippets, stringSnippets } = getSnippets(originCode)

    if (stringSnippets.length) {
      const values = jsSnippets.map((jsSnippet, index) => {
        if (jsSnippet) {
          try {
            const value = this.evaluateExpression(jsSnippet, context)
            return value
          } catch {
            return undefined
          }
        } else {
          return stringSnippets[index]
        }
      })
      if (stringSnippets.length === 1) {
        return values[0]
      }
      return templateSubstituteDynamicValues(originCode, stringSnippets, values)
    }
  }

  execute(script: string, context: SandboxContext = {}): any {
    try {
      let evalResult = this.getDynamicValue(script, context)
      return { type: getResultType(evalResult), value: evalResult }
    } catch (error) {
      return {
        type: "error",
        value: (error as Error).message,
      }
    }
  }
  checkRun(script: string, context: SandboxContext = {}): ExpressionResult[] {
    const expressionResults: ExpressionResult[] = []

    const { jsSnippets, stringSnippets } = getSnippets(script)

    if (stringSnippets.length) {
      jsSnippets.forEach((jsSnippet, index) => {
        if (jsSnippet) {
          try {
            const value = this.evaluateExpression(jsSnippet, context)
            expressionResults.push({
              value: `{{${jsSnippet}}}`,
              hasError: false,
            })
            return value
          } catch {
            expressionResults.push({
              value: `{{${jsSnippet}}}`,
              hasError: true,
            })
            return undefined
          }
        } else {
          return stringSnippets[index]
        }
      })
    }

    return expressionResults
  }
}

export default new Sandbox()
