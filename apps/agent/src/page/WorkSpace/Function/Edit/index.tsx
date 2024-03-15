import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { aiFunctionResourceInit } from "@illa-public/public-configs"
import { IAIFunctionResource } from "@illa-public/public-types"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import PublishButton from "./components/PublishButton"
import FormContext from "./context/FormContext"
import EditPanel from "./modules/EditPanel"
import { contentContainerStyle } from "./style"

const EditFunction: FC = () => {
  const methods = useForm<IAIFunctionResource>({
    defaultValues: aiFunctionResourceInit,
  })
  return (
    <FormProvider {...methods}>
      <FormContext>
        <WorkspacePCHeaderLayout
          title="Edit function"
          extra={<PublishButton />}
        />
        <div css={contentContainerStyle}>
          <EditPanel />
        </div>
      </FormContext>
    </FormProvider>
  )
}

export default EditFunction
