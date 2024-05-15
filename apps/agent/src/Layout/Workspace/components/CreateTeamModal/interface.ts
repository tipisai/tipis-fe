import { SubmitHandler } from "react-hook-form"

export interface CreateTeamFields {
  name: string
  identify: string
}

export interface CreateTeamModalProps {
  loading: boolean
  onSubmit: SubmitHandler<CreateTeamFields>
  onCancel: () => void
  visible: boolean
}
