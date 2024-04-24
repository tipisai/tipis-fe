import { TIntegrationType } from "@illa-public/public-types"

export interface ICreateOrSelectIntegrationProps {
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
}

export interface ICreateOrSelectIntegrationModalProps {
  open: boolean
  changeOpen: (open: boolean) => void
  integrationType: TIntegrationType
  onConfirm: (integrationID: string) => void
}
