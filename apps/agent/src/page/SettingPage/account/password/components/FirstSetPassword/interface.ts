import { SubmitHandler } from "react-hook-form"

export interface IFirstSetPasswordFields {
  email: string
  verificationCode: string
  newPassword: string
}

export type IFirstSetPasswordMsg = Partial<
  Record<keyof IFirstSetPasswordFields, string>
>

export interface FirstSetPasswordProps {
  loading: boolean
  errorMsg: IFirstSetPasswordMsg
  onSubmit: SubmitHandler<IFirstSetPasswordFields>
  showCountDown: boolean
  onCountDownChange: (showCountDown: boolean) => void
  sendEmail: (email: string) => Promise<void>
}
