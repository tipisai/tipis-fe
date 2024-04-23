import { TIntegrationType } from "@illa-public/public-types"

export interface ResourceCardSelectorProps {
  resourceType: TIntegrationType
  onSelect: (item: TIntegrationType) => void
}
