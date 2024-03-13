import { SubmitHandler } from "react-hook-form"

export interface ChangePasswordProps {
  loading: boolean
  onSubmit: SubmitHandler<IChangePasswordFields>
}

export interface IChangePasswordFields {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
