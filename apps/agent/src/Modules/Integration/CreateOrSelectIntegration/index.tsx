import { FC } from "react"
// import { useGetIntegrationListQuery } from "@/redux/services/integrationAPI"
// import { useGetCurrentTeamInfo } from "@/utils/team"
import { IIntegrationSelectorProps } from "./interface"
import CreateIntegration from "./modules/CreateIntegration"
import SelectAndCreateIntegration from "./modules/SelectAndCreate"

const hasResource = true

const IntegrationSelector: FC<IIntegrationSelectorProps> = (props) => {
  // const currentTeamInfo = useGetCurrentTeamInfo()
  // const { data, error } = useGetIntegrationListQuery(currentTeamInfo!.id)

  const { onConfirm, integrationType } = props
  return hasResource ? (
    <SelectAndCreateIntegration
      onConfirm={onConfirm}
      integrationType={integrationType}
    />
  ) : (
    <CreateIntegration
      onConfirm={onConfirm}
      integrationType={integrationType}
    />
  )
}

export default IntegrationSelector
