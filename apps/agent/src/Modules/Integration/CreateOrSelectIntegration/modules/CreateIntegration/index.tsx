import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { IBaseIntegration } from "@illa-public/public-types"
import ConfigElement from "../../../ConfigElement"
import ConfigElementFooter from "./components/Footer"
import { ICreateIntegrationProps } from "./interface"

const CreateIntegration: FC<ICreateIntegrationProps> = (props) => {
  const { onBack, onConfirm, integrationType } = props

  const methods = useForm<IBaseIntegration>({
    defaultValues: {
      resourceName: "",
      resourceType: integrationType,
    },
  })

  const onSubmit = (data: IBaseIntegration) => {
    console.log("ddddd", data)
    onConfirm(data.resourceID)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <ConfigElement />
        <ConfigElementFooter onBack={onBack} />
      </form>
    </FormProvider>
  )
}

export default CreateIntegration
