import { SubmitHandler } from "react-hook-form"

export interface AccountSettingFields {
  nickname: string
}

export interface AccountSettingProps {
  onSubmit: SubmitHandler<AccountSettingFields>
  validAccountReport?: () => void
  handleUpdateAvatar: (file: File) => Promise<boolean>
}
