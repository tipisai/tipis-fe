import { FC } from "react"
import { useGetIntegrationListQuery } from "@/redux/services/integrationAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import FullSectionLoading from "../../../components/FullSectionLoading"
import { IIntegrationSelectorProps } from "./interface"
import CreateIntegration from "./modules/CreateOrUpdateIntegration/createIntegration"
import SelectAndCreateIntegration from "./modules/SelectAndCreate"
import { loadingContainerStyle } from "./style"

const IntegrationSelector: FC<IIntegrationSelectorProps> = (props) => {
  const currentTeamInfo = useGetCurrentTeamInfo()
  const { onConfirm, integrationType, integrationID, defaultStep } = props

  const { data, isLoading } = useGetIntegrationListQuery(currentTeamInfo!.id)

  if (isLoading) {
    return (
      <div css={loadingContainerStyle}>
        <FullSectionLoading />
      </div>
    )
  }

  return data ? (
    <SelectAndCreateIntegration
      onConfirm={onConfirm}
      integrationType={integrationType}
      integrationID={integrationID}
      defaultStep={defaultStep}
    />
  ) : (
    <CreateIntegration
      onConfirm={onConfirm}
      integrationType={integrationType}
    />
  )
}

export default IntegrationSelector
