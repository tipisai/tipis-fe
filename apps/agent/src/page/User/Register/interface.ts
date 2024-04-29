import { SubmitHandler } from "react-hook-form"
import { RegisterFields } from "../interface"

export type RegisterErrorMsg = Partial<Record<keyof RegisterFields, string>>

export interface RegisterProps {
  loading: boolean
  errorMsg: RegisterErrorMsg
  onSubmit: SubmitHandler<RegisterFields>
  showCountDown: boolean
  lockedEmail?: string | null
  onCountDownChange: (showCountDown: boolean) => void
}
