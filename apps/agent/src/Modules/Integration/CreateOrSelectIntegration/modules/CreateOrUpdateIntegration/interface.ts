import { TIntegrationType } from "@illa-public/public-types"
import { IBaseIntegration } from "@illa-public/public-types"

export interface ICreateIntegrationProps {
  onBack?: () => void
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
}

export interface IEditIntegrationDataProviderProps {
  onBack?: () => void
  onConfirm: (integrationID: string) => void
  integrationID: string
}

export interface IEditIntegrationProps {
  onBack?: () => void
  onConfirm: (integrationID: string) => void
  integration: IBaseIntegration<unknown>
}

export interface ICreateOrEditIntegrationProps {
  onBack?: () => void
  onConfirm: (integrationID: string) => void
  integrationID: string
  integrationType: TIntegrationType
}
