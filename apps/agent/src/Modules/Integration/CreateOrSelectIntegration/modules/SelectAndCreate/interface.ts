import { TIntegrationType } from "@illa-public/public-types"

export enum SELECT_INTEGRATION_STEP {
  SELECT_OR_CREATE = "SELECT_OR_CREATE",
  EDIT = "EDIT",
  CREATE = "CREATE",
}

export interface ISelectAndCreateIntegrationProps {
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
  integrationID: string
  defaultStep?: SELECT_INTEGRATION_STEP
}
