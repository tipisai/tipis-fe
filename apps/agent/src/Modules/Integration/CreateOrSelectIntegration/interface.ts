import { TIntegrationType } from "@illa-public/public-types"

export interface IIntegrationSelectorProps {
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
  integrationID: string
}

export interface IIntegrationSelectorModalProps {
  open: boolean
  changeOpen: (open: boolean) => void
  integrationType: TIntegrationType
  integrationID: string
  onConfirm: (integrationID: string) => void
}

export interface ISelectIntegrationInject {
  setModalName: (name: string) => void
  modalName: string
}
