import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import WorkspacePCHeaderLayout from "@/Layout/Workspace/pc/components/Header"
import PublishButton from "./components/PublishButton"
import FormContext from "./context/FormContext"
import DocPanel from "./modules/DocPanel"
import EditPanel from "./modules/EditPanel"
import { contentContainerStyle, innerContentContainerStyle } from "./style"

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
