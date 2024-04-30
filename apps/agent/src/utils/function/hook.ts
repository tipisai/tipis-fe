import { App } from "antd"
import { useCallback } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { DATA_VALUE_TYPE } from "@illa-public/code-editor-new"
import { ICompletionOption } from "@illa-public/code-editor-new/CodeMirror/extensions/interface"
import { DEFAULT_LARK_BOT_PARAMETERS } from "@illa-public/public-configs/function/larkBot"
import { DEFAULT_TENCENT_COS_PARAMETERS } from "@illa-public/public-configs/function/tencentCos"
import { TENCENT_COS_ACTION_OPERATION } from "@illa-public/public-types"
import { IVariables, VARIABLE_TYPE } from "@illa-public/public-types"
import { IFunctionForm } from "@/page/WorkSpace/Function/interface"
import {
  useGetAIToolIconUploadAddressMutation,
  useTestRunAIToolsMutation,
} from "@/redux/services/aiToolsAPI"
import { IAIToolDTO } from "@/redux/services/aiToolsAPI/interface"
import { getCurrentTabID } from "@/redux/ui/recentTab/selector"
import { TestRunResultEventEmitter } from "."
import { FUNCTION_RUN_RESULT_EVENT } from "../eventEmitter/constants"
import { fetchUploadBase64 } from "../file"
import {
  useFindRecentTabByTabID,
  useRemoveRecentTabReducer,
} from "../recentTabs/baseHook"
import { CREATE_FUNCTION_ID } from "../recentTabs/constants"
import {
  useUpdateCreateToEditFunctionTab,
  useUpdateCurrentTabToTipisDashboard,
} from "../recentTabs/hook"
import {
  CREATE_FUNCTION_FROM_SINGLE,
  CREATE_FUNCTION_FROM_SINGLE_KEY,
  CREATE_FUNCTION_FROM_TAB_KEY,
  genTabNavigateLink,
} from "../routeHelper"
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

  const [testRunAITools, { data: runAIToolsData, isLoading, error, isError }] =
    useTestRunAIToolsMutation({
      fixedCacheKey: "testRunAITools",
    })

  const onTestRunFunction = async (formData: Record<string, string>) => {
    try {
      const data = await testRunAITools({
        teamID: currentTeamInfo?.id,
        testData: {
          resourceID: resourceID,
          resourceType: resourceType,
          actionOperation: actionOperation,
          parameters: parameterList,
          content: content,
          context: formData,
        },
      }).unwrap()
      TestRunResultEventEmitter.emit(
        FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
        true,
      )

      TestRunResultEventEmitter.emit(FUNCTION_RUN_RESULT_EVENT.SET_RUN_RESULT, {
        statusCode: 200,
        result: JSON.stringify(data.data, null, 2),
      })
    } catch (e) {
      TestRunResultEventEmitter.emit(
        FUNCTION_RUN_RESULT_EVENT.CHANGE_DRAWER_OPEN_STATUS,
        true,
      )
      TestRunResultEventEmitter.emit(FUNCTION_RUN_RESULT_EVENT.SET_RUN_RESULT, {
        statusCode: 400,
        result: JSON.stringify(e, null, 2),
      })
    }
  }
  return {
    onTestRunFunction,
    testResult: runAIToolsData || error,
    isLoading,
    isError,
  }
}

export const useGetIconURL = () => {
  const currentTeamInfo = useGetCurrentTeamInfo()!

  const [getAIToolIconUploadAddress] = useGetAIToolIconUploadAddressMutation()

  const getIconURL = useCallback(
    async (iconData: string) => {
      const iconURL = new URL(iconData)
      if (iconURL.protocol === "data:") {
        const { uploadAddress } = await getAIToolIconUploadAddress({
          teamID: currentTeamInfo.id,
          base64: iconData,
        }).unwrap()
        return await fetchUploadBase64(uploadAddress, iconData)
      }
      if (iconURL.protocol === "http:" || iconURL.protocol === "https:") {
        return iconData
      }

      return ""
    },
    [currentTeamInfo.id, getAIToolIconUploadAddress],
  )

  return getIconURL
}

export const useOpenTipsWhenSubmit = () => {
  const { t } = useTranslation()
  const { message, modal } = App.useApp()

  const [searchParams] = useSearchParams()

  const updateCreateToEditFunctionTab = useUpdateCreateToEditFunctionTab()
  const updateCurrentTabToTipisDashboard = useUpdateCurrentTabToTipisDashboard()
  const removeTab = useRemoveRecentTabReducer()
  const findTabByTabID = useFindRecentTabByTabID()
  const navigate = useNavigate()
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const currentTabID = useSelector(getCurrentTabID)

  const openCreateSuccessModal = (serverData: IAIToolDTO<unknown>) => {
    modal.success({
      closable: true,
      title: t("function.edit.modal.save.title"),
      content: t("function.edit.modal.save.desc"),
      okText: t("function.edit.modal.save.button"),
      onOk: async () => {
        return updateCurrentTabToTipisDashboard({
          tabName: serverData.name,
          tabIcon: "",
          cacheID: serverData.aiToolID,
        })
      },
      onCancel: async () => {
        return updateCreateToEditFunctionTab(CREATE_FUNCTION_ID, {
          tabName: serverData.name,
          tabIcon: "",
          cacheID: serverData.aiToolID,
        })
      },
    })
  }

  const openUpdateSuccessModal = (serverData: IAIToolDTO<unknown>) => {
    modal.success({
      closable: true,
      title: t("function.edit.modal.update.title"),
      content: t("function.edit.modal.update.desc"),
      okText: t("function.edit.modal.save.button"),
      onOk: async () => {
        return updateCurrentTabToTipisDashboard({
          tabName: serverData.name,
          tabIcon: "",
          cacheID: serverData.aiToolID,
        })
      },
    })
  }

  const openTipsWhenSubmit = async (
    serverData: IAIToolDTO<unknown>,
    modalType: "create" | "edit" = "create",
  ) => {
    const defaultAlertMethod =
      modalType === "edit" ? openUpdateSuccessModal : openCreateSuccessModal

    const from = searchParams.get(
      CREATE_FUNCTION_FROM_SINGLE_KEY,
    ) as CREATE_FUNCTION_FROM_SINGLE | null

    const createFromTabID = searchParams.get(CREATE_FUNCTION_FROM_TAB_KEY)

    if (!from || !createFromTabID) {
      defaultAlertMethod(serverData)
      return
    }

    const tabInfo = findTabByTabID(createFromTabID)

    if (!tabInfo) {
      defaultAlertMethod(serverData)
      return
    }

    switch (from) {
      case CREATE_FUNCTION_FROM_SINGLE.DASHBOARD: {
        defaultAlertMethod(serverData)
        return
      }
      case CREATE_FUNCTION_FROM_SINGLE.EDIT_TIPIS: {
        message.success(t("function.edit.message.updated"))
        break
      }

      case CREATE_FUNCTION_FROM_SINGLE.CREATE_TIPIS: {
        message.success(t("function.edit.message.created"))

        break
      }
    }
    console.log("currentTabID", currentTabID)
    await removeTab(currentTabID)
    const newSearchParams = new URLSearchParams({
      aiToolID: serverData.aiToolID,
      aiToolName: serverData.name,
      aiToolIcon: serverData.config.icon,
    })
    navigate(
      `${genTabNavigateLink(
        currentTeamInfo.identifier,
        tabInfo.tabType,
        tabInfo.cacheID,
        tabInfo.tabID,
      )}?${newSearchParams.toString()}`,
    )
  }

  return openTipsWhenSubmit
}
