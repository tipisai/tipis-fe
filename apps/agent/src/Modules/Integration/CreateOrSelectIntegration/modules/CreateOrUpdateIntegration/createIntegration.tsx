import { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { INTEGRATION_TYPE_MAP_CONFIG } from "@illa-public/public-configs"
import { IBaseIntegration } from "@illa-public/public-types"
import { useGetResourceNameFormResourceType } from "@illa-public/utils"
import ConfigElement from "../../../ConfigElement"
import { useIntegrationSelectorContext } from "../../utils"
import ConfigElementFooter from "./components/Footer"
import { ICreateIntegrationProps } from "./interface"

const CreateIntegration: FC<ICreateIntegrationProps> = (props) => {
  const { onBack, onConfirm, integrationType } = props

  const methods = useForm<IBaseIntegration>({
    defaultValues: INTEGRATION_TYPE_MAP_CONFIG[integrationType],
    mode: "onChange",
  })

  const { setModalName } = useIntegrationSelectorContext()
  const getResourceNameFromResourceType = useGetResourceNameFormResourceType()

  useEffect(() => {
    setModalName(getResourceNameFromResourceType(integrationType))
  }, [getResourceNameFromResourceType, integrationType, setModalName])

  return (
    <FormProvider {...methods}>
      <ConfigElement integrationType={integrationType} />
      <ConfigElementFooter onBack={onBack} onConfirm={onConfirm} />
    </FormProvider>
  )
}

export default CreateIntegration
