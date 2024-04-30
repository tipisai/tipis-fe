import { TIntegrationType } from "@illa-public/public-types"

export interface ISelectIntegrationProps {
  onClickCreate: () => void
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
}
