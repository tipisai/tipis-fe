import { App } from "antd"
import { FC, useCallback, useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  useBeforeUnload,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
// import { DraggableModal } from "@illa-public/draggable-modal"
import { getFunctionInitDataByType } from "@illa-public/public-configs"
import { IBaseFunction, TIntegrationType } from "@illa-public/public-types"
import { getCurrentId } from "@illa-public/user-data"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { useCreateAIToolMutation } from "@/redux/services/aiToolsAPI"
import store from "@/redux/store"
import { getRecentTabInfos } from "@/redux/ui/recentTab/selector"
import { useGetIconURL } from "@/utils/function/hook"
import {
  getFormDataByTabID,
  setFormDataByTabID,
} from "@/utils/localForage/formData"
import {
  useFindRecentTabByTabID,
  useRemoveRecentTabReducer,
} from "@/utils/recentTabs/baseHook"
import { CREATE_FUNCTION_ID } from "@/utils/recentTabs/constants"
import {
  useAddCreateFunction,
  useUpdateCreateToEditFunctionTab,
  useUpdateCurrentTabToTipisDashboard,
} from "@/utils/recentTabs/hook"
import {
  CREATE_FUNCTION_FROM_SINGLE,
  CREATE_FUNCTION_FROM_SINGLE_KEY,
  CREATE_FUNCTION_FROM_TAB_KEY,
  genTabNavigateLink,
} from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"
import TestRunResult from "./components/TestRunResult"
import { IFunctionForm } from "./interface"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import HeaderTools from "./modules/HeaderTools"
import { contentContainerStyle, formStyle } from "./style"

const CreateFunction: FC = () => {
  const { functionType } = useParams()
  const { message, modal } = App.useApp()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const INITConfig = getFunctionInitDataByType(functionType as TIntegrationType)
  const createFunctionTab = useAddCreateFunction()
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const updateCreateToEditFunctionTab = useUpdateCreateToEditFunctionTab()
  const updateCurrentTabToTipisDashboard = useUpdateCurrentTabToTipisDashboard()
  const removeTab = useRemoveRecentTabReducer()
  const findTabByTabID = useFindRecentTabByTabID()
  const navigate = useNavigate()

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
  })

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

      const defaultAlertMethod = () => {
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

      const from = searchParams.get(
        CREATE_FUNCTION_FROM_SINGLE_KEY,
      ) as CREATE_FUNCTION_FROM_SINGLE

      const createFromTabID = searchParams.get(CREATE_FUNCTION_FROM_TAB_KEY)

      if (!from || !createFromTabID) {
        defaultAlertMethod()
        return
      }

      const tabInfo = findTabByTabID(createFromTabID)

      if (!tabInfo) {
        defaultAlertMethod()
        return
      }

      switch (from) {
        case CREATE_FUNCTION_FROM_SINGLE.EDIT_TIPIS: {
          message.success(t("function.edit.modal.save.title"))
          await removeTab(functionType!)
          navigate(
            genTabNavigateLink(
              currentTeamInfo.identifier,
              tabInfo.tabType,
              tabInfo.cacheID,
              tabInfo.tabID,
            ),
          )
          break
        }
        case CREATE_FUNCTION_FROM_SINGLE.CREATE_TIPIS: {
          message.success(t("function.edit.modal.save.title"))
          await removeTab(functionType!)
          navigate(
            genTabNavigateLink(
              currentTeamInfo.identifier,
              tabInfo.tabType,
              tabInfo.cacheID,
              tabInfo.tabID,
            ),
          )

          break
        }
        case CREATE_FUNCTION_FROM_SINGLE.DASHBOARD: {
          defaultAlertMethod()
        }
      }
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
