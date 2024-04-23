import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { getFunctionInitDataByType } from "@illa-public/public-configs"
import { TIntegrationType } from "@illa-public/public-types"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import PublishButton from "./components/PublishButton"
import FormContext from "./context/FormContext"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import { contentContainerStyle, innerContentContainerStyle } from "./style"

const CreateFunction: FC = () => {
  const { functionType } = useParams()

  const INITConfig = getFunctionInitDataByType(functionType as TIntegrationType)

  const methods = useForm({
    defaultValues: INITConfig,
    mode: "onChange",
  })
  return (
    <FormProvider {...methods}>
      <FormContext>
        <WorkspacePCHeaderLayout
          title="Edit function"
          extra={<PublishButton />}
        />
        <div css={contentContainerStyle}>
          <div css={innerContentContainerStyle}>
            <EditPanel />
            <DocPanel />
          </div>
        </div>
      </FormContext>
    </FormProvider>
  )
}

export default CreateFunction
