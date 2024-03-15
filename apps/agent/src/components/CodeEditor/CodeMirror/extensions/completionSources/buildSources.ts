import { CompletionContext, CompletionResult } from "@codemirror/autocomplete"
import {
  Cassandra,
  MSSQL,
  MariaSQL,
  MySQL,
  PLSQL,
  PostgreSQL,
  SQLite,
  StandardSQL,
  keywordCompletionSource,
  schemaCompletionSource,
} from "@codemirror/lang-sql"
import { CODE_LANG, CODE_TYPE } from "../interface"
import { ternSeverCompletionSource } from "./TernServer"
import { buildILLAContextCompletionSource } from "./illaContext"

const buildSqlSchemeSources = (sqlScheme: Record<string, unknown>) => {
  const requiredScheme: { [table: string]: string[] } = {}
  Object.keys(sqlScheme).forEach((tableName) => {
    if (
      sqlScheme[tableName] &&
      Object.prototype.toString.call(sqlScheme[tableName]) === "[object Object]"
    ) {
      requiredScheme[tableName] = Object.keys(
        sqlScheme[tableName] as Record<string, unknown>,
      )
    }
  })
  const completionSourceFunc = schemaCompletionSource({
    schema: requiredScheme,
  })
  return (context: CompletionContext) => {
    const completionSource = completionSourceFunc(context) as CompletionResult
    if (Array.isArray(completionSource?.options)) {
      completionSource.options = completionSource.options.map((option) => {
        return {
          ...option,
          type: "table",
        }
      })
    }

    return completionSource
  }
}

const buildSqlKeywordSources = (lang: CODE_LANG) => {
  switch (lang) {
    case CODE_LANG.PLSQL: {
      return keywordCompletionSource(PLSQL, true)
    }
    case CODE_LANG.CASSANDRA: {
      return keywordCompletionSource(Cassandra, true)
    }
    case CODE_LANG.SQLite: {
      return keywordCompletionSource(SQLite, true)
    }
    case CODE_LANG.MSSQL: {
      return keywordCompletionSource(MSSQL, true)
    }
    case CODE_LANG.MARIASQL: {
      return keywordCompletionSource(MariaSQL, true)
    }
    case CODE_LANG.MYSQL: {
      return keywordCompletionSource(MySQL, true)
    }
    case CODE_LANG.PGSQL: {
      return keywordCompletionSource(PostgreSQL, true)
    }
    default:
    case CODE_LANG.SQL: {
      return keywordCompletionSource(StandardSQL, true)
    }
  }
}

export const buildCompletionSources = (
  codeType: CODE_TYPE,
  lang: CODE_LANG,
  sqlScheme: Record<string, unknown>,
  completeOptions: Record<string, unknown>,
) => {
  const ternSource = ternSeverCompletionSource(codeType)
  const illaSources = buildILLAContextCompletionSource(
    completeOptions,
    codeType,
  )
  const completionSources = [ternSource, illaSources]

  switch (lang) {
    case CODE_LANG.PGSQL:
    case CODE_LANG.MARIASQL:
    case CODE_LANG.MSSQL:
    case CODE_LANG.SQLite:
    case CODE_LANG.CASSANDRA:
    case CODE_LANG.PLSQL:
    case CODE_LANG.MYSQL:
    case CODE_LANG.SQL: {
      const sqlKeywordsSources = buildSqlKeywordSources(lang)
      const sqlSchemeSources = buildSqlSchemeSources(sqlScheme)
      completionSources.push(sqlKeywordsSources, sqlSchemeSources)
      break
    }
    default: {
      break
    }
  }
  return completionSources
}
