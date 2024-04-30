import { FC } from "react"
import { useGetIntegrationListQuery } from "@/redux/services/integrationAPI"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { IIntegrationListProps } from "./interface"
import IntegrationListItem from "./item"
import { listContainerStyle } from "./style"

const IntegrationList: FC<IIntegrationListProps> = (props) => {
  const { onClickItem, selectedIntegrationID, integrationType } = props

  const currentTeamInfo = useGetCurrentTeamInfo()

  const { integrationList } = useGetIntegrationListQuery(currentTeamInfo!.id, {
    selectFromResult: ({ data }) => ({
      integrationList: (data ?? []).filter(
        (item) => item.resourceType === integrationType,
      ),
    }),
  })

  return (
    <div css={listContainerStyle}>
      {integrationList.map((item) => (
        <IntegrationListItem
          key={item.resourceID}
          integrationType={item.resourceType}
          integrationName={item.resourceName}
          integrationID={item.resourceID}
          onClickItem={onClickItem}
          isSelected={selectedIntegrationID === item.resourceID}
        />
      ))}
    </div>
  )
}

export default IntegrationList
