import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
// import { DraggableModal } from "@illa-public/draggable-modal"
import { getFunctionInitDataByType } from "@illa-public/public-configs"
import { IBaseFunction, TIntegrationType } from "@illa-public/public-types"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import { useCreateAIToolMutation } from "@/redux/services/aiToolsAPI"
import TestRunResult from "./components/TestRunResult"
import { IFunctionForm } from "./interface"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import HeaderTools from "./modules/HeaderTools"
import { contentContainerStyle, formStyle } from "./style"

const CreateFunction: FC = () => {
  const { functionType } = useParams()

  const INITConfig = getFunctionInitDataByType(functionType as TIntegrationType)

  const methods = useForm<IFunctionForm>({
    defaultValues: INITConfig,
    mode: "onChange",
  })

  const [createAITool] = useCreateAIToolMutation()

  const createFunctionWhenSubmit = async (data: IFunctionForm) => {
    const aiTool: IBaseFunction = {
      ...data,
      resourceID: data.integrationInfo.resourceID,
    }
    try {
      await createAITool({
        teamID: "1",
        aiTool: aiTool,
      })
    } catch {}
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
