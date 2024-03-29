import { SubmitHandler } from "react-hook-form"

export interface CreateTeamFields {
  name: string
  identifier: string
}

export interface CreateTeamModalProps {
  loading: boolean
  onSubmit: SubmitHandler<CreateTeamFields>
  onCancel: () => void
  visible: boolean
}
