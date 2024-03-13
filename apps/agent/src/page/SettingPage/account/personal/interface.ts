import { SubmitHandler } from "react-hook-form"

export interface AccountSettingFields {
  nickname: string
}

export interface AccountSettingProps {
  loading: boolean
  onSubmit: SubmitHandler<AccountSettingFields>
  validAccountReport?: () => void
  handleUpdateAvatar: (file: Blob) => Promise<boolean>
}
