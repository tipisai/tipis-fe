import { SubmitHandler } from "react-hook-form"
import { ResetPwdFields } from "../interface"

export type ResetPwdErrorMsg = Partial<Record<keyof ResetPwdFields, string>>

export interface ResetProps {
  showCountDown: boolean
  onCountDownChange: (showCountDown: boolean) => void
  validEventReport?: () => void
  lockedEmail?: string | null
  resetLabel?: string
  loading: boolean
  errorMsg: ResetPwdErrorMsg
  onSubmit: SubmitHandler<ResetPwdFields>
}
