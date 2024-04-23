import { TIntegrationType } from "@illa-public/public-types"

export interface ICreateOrSelectIntegrationProps {
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
}
