import { TIntegrationType } from "@illa-public/public-types"

export interface IIntegrationTypeSelectorProps {
  onSelect: (item: TIntegrationType) => void
  filterIntegrationType?: (item: TIntegrationType) => boolean
}
