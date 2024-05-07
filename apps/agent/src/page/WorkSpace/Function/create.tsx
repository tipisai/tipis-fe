import { App } from "antd"
import { FC, useCallback, useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBeforeUnload, useParams } from "react-router-dom"
import { getFunctionInitDataByType } from "@illa-public/public-configs"
import { IBaseFunction, TIntegrationType } from "@illa-public/public-types"
import { TipisTrack } from "@illa-public/track-utils"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { useCreateAIToolMutation } from "@/redux/services/aiToolsAPI"
import store from "@/redux/store"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { useGetIconURL, useOpenTipsWhenSubmit } from "@/utils/function/hook"
import {
  getFormDataByTabID,
  setFormDataByTabID,
} from "@/utils/localForage/formData"
import { CREATE_FUNCTION_ID } from "@/utils/recentTabs/constants"
import { useAddCreateFunction } from "@/utils/recentTabs/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import TestRunResult from "./components/TestRunResult"
import { IFunctionForm } from "./interface"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import HeaderTools from "./modules/HeaderTools"
import { contentContainerStyle, formStyle } from "./style"

const CreateFunction: FC = () => {
  const { functionType } = useParams()
  const { message } = App.useApp()
  const { t } = useTranslation()

  const INITConfig = getFunctionInitDataByType(functionType as TIntegrationType)
  const createFunctionTab = useAddCreateFunction()
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const openTips = useOpenTipsWhenSubmit()

  const methods = useForm<IFunctionForm>({
    defaultValues: INITConfig,
    mode: "onChange",
  })

  const [createAITool] = useCreateAIToolMutation()

  const getIconURL = useGetIconURL()

  useEffect(() => {
    if (functionType) {
      createFunctionTab(functionType)
    }
  }, [createFunctionTab, functionType])

  const { control, reset } = methods

  const values = useWatch({
    control,
  })

  const setUiHistoryFormData = useCallback(async () => {
    const tabID = CREATE_FUNCTION_ID
    const teamID = getCurrentId(store.getState())!
    const historyTabs = getRecentTabInfos(store.getState())
    const currentTab = historyTabs.find((tab) => tab.tabID === tabID)
    if (!currentTab) return
    const formData = await getFormDataByTabID(teamID, tabID)

    if (formData) {
      await setFormDataByTabID(teamID, tabID, {
        ...formData,
        ...values,
      })
    } else {
      await setFormDataByTabID(teamID, tabID, values)
    }
  }, [values])

  const createFunctionWhenSubmit = async (data: IFunctionForm) => {
    TipisTrack.track("create_function", {
      parameter1: "edit_function",
      parameter2: data.resourceType,
    })
    const icon = data.config.icon

    const aiTool: IBaseFunction = {
      config: {
        ...data.config,
        icon: icon ? icon : "",
      },
      content: data.content,
      description: data.description,
      name: data.name,
      parameters: data.parameters,
      resourceType: data.resourceType,
      resourceID: data.integrationInfo.resourceID,
      actionOperation: data.actionOperation,
    }
    try {
      const iconURL = await getIconURL(aiTool.config.icon)

      const serverData = await createAITool({
        teamID: currentTeamInfo?.id,
        aiTool: {
          ...aiTool,
          config: {
            ...aiTool.config,
            icon: iconURL,
          },
        },
      }).unwrap()
      await openTips(serverData)
    } catch (e) {
      message.error(t("function.edit.message.failed_to_create"))
    }
  }

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      const tabID = CREATE_FUNCTION_ID
      const teamID = getCurrentId(store.getState())!
      const formData = await getFormDataByTabID(teamID, tabID)
      if (formData) {
        reset(formData)
      }
    }
    getHistoryDataAndSetFormData()
  }, [reset])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    setUiHistoryFormData()
  }, [setUiHistoryFormData])

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(createFunctionWhenSubmit)}
        css={formStyle}
      >
        <WorkspacePCHeaderLayout
          title="Edit function"
          extra={<HeaderTools />}
        />
        <div css={contentContainerStyle}>
          <EditPanel />
          <DocPanel />
          <TestRunResult />
        </div>
      </form>
    </FormProvider>
  )
}

export default CreateFunction
