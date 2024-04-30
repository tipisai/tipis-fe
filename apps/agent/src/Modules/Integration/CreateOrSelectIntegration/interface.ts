import { TIntegrationType } from "@illa-public/public-types"
import { SELECT_INTEGRATION_STEP } from "./modules/SelectAndCreate/interface"

export interface IIntegrationSelectorProps {
  onConfirm: (integrationID: string) => void
  integrationType: TIntegrationType
  integrationID: string
  defaultStep?: SELECT_INTEGRATION_STEP
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
