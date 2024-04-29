import { useFormContext, useWatch } from "react-hook-form"
import { DATA_VALUE_TYPE } from "@illa-public/code-editor-new"
import { ICompletionOption } from "@illa-public/code-editor-new/CodeMirror/extensions/interface"
import { DEFAULT_LARK_BOT_PARAMETERS } from "@illa-public/public-configs/function/larkBot"
import { DEFAULT_TENCENT_COS_PARAMETERS } from "@illa-public/public-configs/function/tencentCos"
import { TENCENT_COS_ACTION_OPERATION } from "@illa-public/public-types"
import { IVariables, VARIABLE_TYPE } from "@illa-public/public-types"
import { IFunctionForm } from "@/page/WorkSpace/Function/CreateOrEdit/interface"
import { TestRunResultEventEmitter } from "."
import { useTestRunAIToolsMutation } from "../../redux/services/aiToolsAPI"
import { FUNCTION_RUN_RESULT_EVENT } from "../eventEmitter/constants"
import { useGetCurrentTeamInfo } from "../team"

export const useGetParamsListByResourceType = () => {
  const { control } = useFormContext<IFunctionForm>()
  const [resourceType, actionOperation, parameters] = useWatch({
    control,
    name: ["resourceType", "actionOperation", "parameters"],
  })

  switch (resourceType) {
    case "tencentcos": {
      switch (actionOperation) {
        case TENCENT_COS_ACTION_OPERATION.TENCENT_COS_DOWNLOAD: {
          return DEFAULT_TENCENT_COS_PARAMETERS
        }
        default: {
          return []
        }
      }
    }
    case "larkBot": {
      return DEFAULT_LARK_BOT_PARAMETERS
    }

    default:
      return parameters
  }
}

type TTransResult = ICompletionOption & {
  depth: number
  originType: VARIABLE_TYPE
  required: boolean
  name: string
  parentKey: string
}

function variableToCompletionOption(variable: IVariables): TTransResult[] {
  // Define the mapping from VARIABLE_TYPE to DATA_VALUE_TYPE
  const typeMapping: { [key in VARIABLE_TYPE]: DATA_VALUE_TYPE } = {
    [VARIABLE_TYPE.STRING]: DATA_VALUE_TYPE.STRING,
    [VARIABLE_TYPE.INT]: DATA_VALUE_TYPE.NUMBER,
    [VARIABLE_TYPE.FLOAT]: DATA_VALUE_TYPE.NUMBER,
    [VARIABLE_TYPE.BOOLEAN]: DATA_VALUE_TYPE.BOOLEAN,
    [VARIABLE_TYPE.NULL]: DATA_VALUE_TYPE.UNKNOWN,
    [VARIABLE_TYPE.OBJECT]: DATA_VALUE_TYPE.OBJECT,
    [VARIABLE_TYPE.STRING_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.INTEGER_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.NUMBER_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.BOOLEAN_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.NULL_ARRAY]: DATA_VALUE_TYPE.ARRAY,
    [VARIABLE_TYPE.OBJECT_ARRAY]: DATA_VALUE_TYPE.ARRAY,
  }

  // Recursive function to handle objects and their children
  function mapVariable(
    variable: IVariables,
    parentKey: string = "",
    depth: number = 0,
  ): TTransResult[] {
    const baseOption: TTransResult = {
      key: parentKey ? `${parentKey}.${variable.name}` : variable.name,
      name: variable.name,
      value: "",
      description: variable.description,
      type: typeMapping[variable.type],
      originType: variable.type,
      required: variable.required,
      parentKey,
      depth,
    }

    let options: TTransResult[] = [baseOption]

    if (
      variable.type === VARIABLE_TYPE.OBJECT &&
      variable.children.length > 0
    ) {
      const childOptions = variable.children.flatMap((child) =>
        mapVariable(child, baseOption.key, depth + 1),
      )
      options = options.concat(childOptions)
    }

    return options
  }

  return mapVariable(variable)
}

export const useVariableToCompletionOption = () => {
  const { control } = useFormContext<IFunctionForm>()

  const variables = useWatch({
    control,
    name: "parameters",
  })

  return variables.map((v) => variableToCompletionOption(v)).flat()
}

export const useTestRunFunction = () => {
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const parameterList = useGetParamsListByResourceType()

  const { control } = useFormContext<IFunctionForm>()
  const [resourceID, resourceType, actionOperation, content] = useWatch({
    control,
    name: [
      "integrationInfo.resourceID",
      "resourceType",
      "actionOperation",
      "content",
    ],
  })

  const [testRunAITools, { data: runAIToolsData, isLoading }] =
    useTestRunAIToolsMutation()

  const onTestRunFunction = async () => {
    const context = parameterList.reduce(
      (acc, cur) => {
        acc[cur.name] = ""
        return acc
      },
      {} as Record<string, unknown>,
    )
    try {
      const data = await testRunAITools({
        teamID: currentTeamInfo?.id,
        testData: {
          resourceID: resourceID,
          resourceType: resourceType,
          actionOperation: actionOperation,
          parameters: parameterList,
          content: content,
          context,
        },
      }).unwrap()
      TestRunResultEventEmitter.emit(
        FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
        true,
      )

      TestRunResultEventEmitter.emit(FUNCTION_RUN_RESULT_EVENT.SET_RUN_RESULT, {
        statusCode: 200,
        result: JSON.stringify(data, null, 2),
      })
    } catch {}
  }
  return {
    onTestRunFunction,
    testResult: runAIToolsData,
    isLoading,
  }
}
