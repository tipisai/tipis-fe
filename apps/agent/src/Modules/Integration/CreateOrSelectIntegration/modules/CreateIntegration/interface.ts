import { TIntegrationType } from "@illa-public/public-types"

export interface ICreateIntegrationProps {
  onBack?: () => void
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
}
