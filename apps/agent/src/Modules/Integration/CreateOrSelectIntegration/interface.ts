import { TIntegrationType } from "@illa-public/public-types"

export interface IIntegrationSelectorProps {
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
}

export interface IIntegrationSelectorModalProps {
  open: boolean
  changeOpen: (open: boolean) => void
  integrationType: TIntegrationType
  onConfirm: (integrationID: string) => void
}

export interface ISelectIntegrationInject {
  setModalName: (name: string) => void
  modalName: string
}
