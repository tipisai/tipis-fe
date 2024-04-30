import { App } from "antd"
import { FC, useCallback, useEffect, useState } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBeforeUnload, useParams } from "react-router-dom"
import { IBaseFunction } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import {
  useGetAIToolByIDQuery,
  useUpdateAIToolByIDMutation,
} from "@/redux/services/aiToolsAPI"
import { useGetIntegrationListQuery } from "@/redux/services/integrationAPI"
import store from "@/redux/store"
import { TAB_TYPE } from "@/redux/ui/recentTab/interface"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { useGetIconURL, useOpenTipsWhenSubmit } from "@/utils/function/hook"
import {
  getFormDataByTabID,
  setFormDataByTabID,
} from "@/utils/localForage/formData"
import { useAddOrUpdateEditFunctionTab } from "@/utils/recentTabs/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import TestRunResult from "./components/TestRunResult"
import { IEditFunctionProps, IFunctionForm } from "./interface"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import EmptyDetail from "./modules/Empty"
import HeaderTools from "./modules/HeaderTools"
import { contentContainerStyle, formStyle } from "./style"

const EditFunctionDataProvider: FC = () => {
  const { functionID } = useParams()

  const currentTeamInfo = useGetCurrentTeamInfo()!

  const [cacheData, setCacheData] = useState<undefined | IFunctionForm>(
    undefined,
  )

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useGetAIToolByIDQuery({
    teamID: currentTeamInfo.id,
    aiToolID: functionID as string,
  })

  const {
    data: integrationList,
    isLoading: isListLoading,
    isError: isListError,
  } = useGetIntegrationListQuery(currentTeamInfo.id)

  const formattedData: IFunctionForm | undefined = detailData
    ? {
        ...detailData,
        integrationInfo: {
          resourceID:
            integrationList?.find(
              (item) => item.resourceID === detailData.resourceID,
            )?.resourceID || "-1",
          resourceName:
            integrationList?.find(
              (item) => item.resourceID === detailData.resourceID,
            )?.resourceName || "",
        },
        parameters: detailData.parameters || [],
        content: detailData.content || {},
      }
    : undefined

  const addOrUpdateFunctionTab = useAddOrUpdateEditFunctionTab()

  useEffect(() => {
    if (detailData) {
      addOrUpdateFunctionTab({
        functionName: detailData.name,
        functionID: detailData.aiToolID,
      })
    }
  }, [addOrUpdateFunctionTab, detailData])

  useEffect(() => {
    const getHistoryDataAndSetFormData = async () => {
      if (!functionID) return
      const historyTabs = getRecentTabInfos(store.getState())
      const currentTab = historyTabs.find(
        (tab) =>
          tab.cacheID === functionID && tab.tabType === TAB_TYPE.EDIT_FUNCTION,
      )
      if (!currentTab) return
      const teamID = getCurrentId(store.getState())!
      const formData = (await getFormDataByTabID(teamID, currentTab.tabID)) as
        | IFunctionForm
        | undefined

      if (formData) {
        setCacheData(formData)
      }
    }
    getHistoryDataAndSetFormData()
  }, [functionID])

  if (isDetailError || isListError)
    return <EmptyDetail functionID={functionID!} />
  if (isListLoading || isDetailLoading) return <FullSectionLoading />

  return formattedData ? (
    <EditFunction originData={formattedData} cacheData={cacheData} />
  ) : null
}

const EditFunction: FC<IEditFunctionProps> = ({ originData, cacheData }) => {
  const { functionID } = useParams()
  const currentTeamInfo = useGetCurrentTeamInfo()!

  const [updateAITool] = useUpdateAIToolByIDMutation()

  const getIconURL = useGetIconURL()
  const openTips = useOpenTipsWhenSubmit()

  const { t } = useTranslation()

  const { message } = App.useApp()

  const methods = useForm<IFunctionForm>({
    defaultValues: originData,
    mode: "onChange",
  })

  const values = useWatch({
    control: methods.control,
  })

  const setUiHistoryFormData = useCallback(async () => {
    if (!functionID) return
    const historyTabs = getRecentTabInfos(store.getState())
    const currentTab = historyTabs.find((tab) => tab.cacheID === functionID)
    if (!currentTab) return
    const formData = await getFormDataByTabID(
      currentTeamInfo.id,
      currentTab.tabID,
    )
    if (formData) {
      await setFormDataByTabID(currentTeamInfo.id!, currentTab.tabID, {
        ...formData,
        ...values,
      })
    } else {
      await setFormDataByTabID(currentTeamInfo.id!, currentTab.tabID, {
        ...values,
      })
    }
  }, [currentTeamInfo.id, functionID, values])

  const updateFunctionWhenSubmit = async (data: IFunctionForm) => {
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

      const serverData = await updateAITool({
        teamID: currentTeamInfo?.id,
        aiToolID: functionID as string,
        aiTool: {
          ...aiTool,
          config: {
            ...aiTool.config,
            icon: iconURL,
          },
        },
      }).unwrap()
      await openTips(serverData, "edit")
    } catch (e) {
      message.error(t("function.edit.message.failed_to_update"))
    }
  }

  useEffect(() => {
    if (cacheData) {
      methods.reset(cacheData, {
        keepDefaultValues: true,
      })
    }
  }, [cacheData, methods])

  useBeforeUnload(setUiHistoryFormData)

  useEffect(() => {
    setUiHistoryFormData()
  }, [setUiHistoryFormData])

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(updateFunctionWhenSubmit)}
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

export default EditFunctionDataProvider
