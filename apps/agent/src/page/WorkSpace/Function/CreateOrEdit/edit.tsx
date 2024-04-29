import { App } from "antd"
import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { IBaseFunction } from "@illa-public/public-types"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import FullSectionLoading from "@/components/FullSectionLoading"
import {
  useGetAIToolByIDQuery,
  useUpdateAIToolByIDMutation,
} from "@/redux/services/aiToolsAPI"
import { useGetIntegrationListQuery } from "@/redux/services/integrationAPI"
import { useGetIconURL } from "@/utils/function/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import EmptyTipis from "../../AI/components/EmptyTipis"
import TestRunResult from "./components/TestRunResult"
import { IEditFunctionProps, IFunctionForm } from "./interface"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import HeaderTools from "./modules/HeaderTools"
import { contentContainerStyle, formStyle } from "./style"

const EditFunctionDataProvider: FC = () => {
  const { functionID } = useParams()

  const currentTeamInfo = useGetCurrentTeamInfo()!

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

  if (isDetailError || isListError) return <EmptyTipis tipisID={functionID!} />
  if (isListLoading || isDetailLoading) return <FullSectionLoading />

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

  return formattedData ? <EditFunction functionInfo={formattedData} /> : null
}

const EditFunction: FC<IEditFunctionProps> = ({ functionInfo }) => {
  const { functionID } = useParams()

  const { message } = App.useApp()

  const methods = useForm<IFunctionForm>({
    defaultValues: functionInfo,
    mode: "onChange",
  })

  const [updateAITool] = useUpdateAIToolByIDMutation()

  const getIconURL = useGetIconURL()
  const currentTeamInfo = useGetCurrentTeamInfo()!

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

      await updateAITool({
        teamID: currentTeamInfo?.id,
        aiToolID: functionID as string,
        aiTool: {
          ...aiTool,
          config: {
            ...aiTool.config,
            icon: iconURL,
          },
        },
      })
      message.success("Create function successfully")
    } catch (e) {
      message.error("Create function failed")
    }
  }

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
