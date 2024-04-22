import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { aiFunctionResourceInit } from "@illa-public/public-configs"
import { IAIFunctionResource } from "@illa-public/public-types"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import PublishButton from "./components/PublishButton"
import FormContext from "./context/FormContext"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import { contentContainerStyle, innerContentContainerStyle } from "./style"

const EditFunction: FC = () => {
  const methods = useForm<IAIFunctionResource>({
    defaultValues: aiFunctionResourceInit,
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

export default EditFunction
