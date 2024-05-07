import { FC, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { IBaseIntegration } from "@illa-public/public-types"
import { useGetResourceNameFormResourceType } from "@illa-public/utils"
import FullSectionLoading from "@/components/FullSectionLoading"
import { useGetIntegrationListQuery } from "@/redux/services/integrationAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import ConfigElement from "../../../ConfigElement"
import { useIntegrationSelectorContext } from "../../utils"
import ConfigElementFooter from "./components/Footer"
import {
  IEditIntegrationDataProviderProps,
  IEditIntegrationProps,
} from "./interface"

const EditIntegration: FC<IEditIntegrationProps> = (props) => {
  const { onBack, onConfirm, integration } = props

  const methods = useForm<IBaseIntegration>({
    defaultValues: integration,
    mode: "onChange",
  })

  const { setModalName } = useIntegrationSelectorContext()
  const getResourceNameFromResourceType = useGetResourceNameFormResourceType()

  useEffect(() => {
    setModalName(getResourceNameFromResourceType(integration.resourceType))
  }, [getResourceNameFromResourceType, integration, setModalName])

  return (
    <FormProvider {...methods}>
      <ConfigElement integrationType={integration.resourceType} />
      <ConfigElementFooter onBack={onBack} onConfirm={onConfirm} />
    </FormProvider>
  )
}

const EditIntegrationDataProvider: FC<IEditIntegrationDataProviderProps> = (
  props,
) => {
  const { onBack, onConfirm, integrationID } = props
  const currentTeamInfo = useGetCurrentTeamInfo()!
  const { data, isLoading } = useGetIntegrationListQuery(currentTeamInfo.id)

  if (isLoading) {
    return <FullSectionLoading />
  }

  if (!data) return null

  const targetIntegration = data.find(
    (integration) => integration.resourceID === integrationID,
  )
  if (!targetIntegration) return null
  return (
    <EditIntegration
      onConfirm={onConfirm}
      onBack={onBack}
      integration={targetIntegration}
    />
  )
}

export default EditIntegrationDataProvider
