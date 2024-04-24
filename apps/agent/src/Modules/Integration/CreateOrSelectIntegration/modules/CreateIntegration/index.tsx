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

  return (
    <FormProvider {...methods}>
      <ConfigElement />
      <ConfigElementFooter onBack={onBack} onConfirm={onConfirm} />
    </FormProvider>
  )
}

export default CreateIntegration
