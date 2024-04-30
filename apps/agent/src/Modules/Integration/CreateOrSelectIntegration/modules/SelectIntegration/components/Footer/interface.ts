export interface ISelectIntegrationFooterProps {
  selectedIntegration: string
  onConfirm: (selectedIntegrationID: string) => void
  onCreateIntegration?: () => void
}
