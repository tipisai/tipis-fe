import { App } from "antd"
import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
// import { DraggableModal } from "@illa-public/draggable-modal"
import { getFunctionInitDataByType } from "@illa-public/public-configs"
import { IBaseFunction, TIntegrationType } from "@illa-public/public-types"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { useCreateAIToolMutation } from "@/redux/services/aiToolsAPI"
import { useGetIconURL } from "@/utils/function/hook"
import { useGetCurrentTeamInfo } from "@/utils/team"
import TestRunResult from "./components/TestRunResult"
import { IFunctionForm } from "./interface"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import HeaderTools from "./modules/HeaderTools"
import { contentContainerStyle, formStyle } from "./style"

const CreateFunction: FC = () => {
  const { functionType } = useParams()

  const INITConfig = getFunctionInitDataByType(functionType as TIntegrationType)

  const currentTeamInfo = useGetCurrentTeamInfo()!
  const { message } = App.useApp()

  const methods = useForm<IFunctionForm>({
    defaultValues: INITConfig,
    mode: "onChange",
  })

  const [createAITool] = useCreateAIToolMutation()

  const getIconURL = useGetIconURL()

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

      await createAITool({
        teamID: currentTeamInfo?.id,
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
