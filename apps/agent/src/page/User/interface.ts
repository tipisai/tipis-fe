export interface RegisterFields {
  nickname: string
  email: string
  verificationCode: string
  password: string
  isSubscribed: boolean
}

export interface LoginFields {
  email: string
  password: string
}

export interface ResetPwdFields {
  email: string
  verificationCode: string
  newPassword: string
}

export type IAllFormFields = ResetPwdFields & LoginFields & RegisterFields
