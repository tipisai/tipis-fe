import { SubmitHandler } from "react-hook-form"
import { LoginFields } from "../interface"

export type LoginErrorMsg = Record<keyof LoginFields, string>

export interface LoginPageProps {
  errorMsg: LoginErrorMsg
  loading: boolean
  onSubmit: SubmitHandler<LoginFields>
  lockedEmail?: string | null
}
