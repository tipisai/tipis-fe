import { FC } from "react"
import { useGetIntegrationListQuery } from "@/redux/services/integrationAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import FullSectionLoading from "../../../components/FullSectionLoading"
import { IIntegrationSelectorProps } from "./interface"
import CreateOrUpdateIntegration from "./modules/CreateOrUpdateIntegration"
import SelectAndCreateIntegration from "./modules/SelectAndCreate"
import { loadingContainerStyle } from "./style"

const IntegrationSelector: FC<IIntegrationSelectorProps> = (props) => {
  const currentTeamInfo = useGetCurrentTeamInfo()
  const { onConfirm, integrationType, integrationID } = props

  const { data, isLoading } = useGetIntegrationListQuery(currentTeamInfo!.id, {
    skip: !!integrationID,
  })

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
    />
  ) : (
    <CreateOrUpdateIntegration
      onConfirm={onConfirm}
      integrationType={integrationType}
      integrationID={integrationID}
    />
  )
}

export default IntegrationSelector
