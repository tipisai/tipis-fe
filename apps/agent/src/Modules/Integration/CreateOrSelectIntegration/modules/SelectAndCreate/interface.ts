import { TIntegrationType } from "@illa-public/public-types"

export enum SELECT_INTEGRATION_STEP {
  SELECT = "SELECT",
  CREATE = "CREATE",
}

export interface ISelectAndCreateIntegrationProps {
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
}
