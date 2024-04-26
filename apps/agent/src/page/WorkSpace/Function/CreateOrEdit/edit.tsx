import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import HeaderTools from "./modules/HeaderTools"
import { contentContainerStyle, formStyle } from "./style"

const EditFunction: FC = () => {
  const { functionID } = useParams()
  const methods = useForm({
    defaultValues: {
      id: functionID,
    },
    mode: "onChange",
  })
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((_data) => {})} css={formStyle}>
        <WorkspacePCHeaderLayout
          title="Edit function"
          extra={<HeaderTools />}
        />
        <div css={contentContainerStyle}>
          <EditPanel />
          <DocPanel />
        </div>
      </form>
    </FormProvider>
  )
}

export default EditFunction
