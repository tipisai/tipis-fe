import { TIntegrationType } from "@illa-public/public-types"

export interface IIntegrationListItemProps {
  integrationType: TIntegrationType
  integrationName: string
  integrationID: string
  onClickItem: (integrationID: string) => void
  isSelected: boolean
}

export interface IIntegrationListProps {
  onClickItem: (integrationID: string) => void
  selectedIntegrationID: string
  integrationType: TIntegrationType
}
