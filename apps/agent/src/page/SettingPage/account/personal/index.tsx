import { App } from "antd"
import { FC, useEffect, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  getCurrentUser,
  useUpdateNickNameMutation,
  useUpdateUserAvatarMutation,
} from "@illa-public/user-data"
import { track } from "@/utils/mixpanelHelper"
import { useUploadAvatar } from "../../hooks/uploadAvatar"
import { AccountSettingFields } from "./interface"
import MobileAccountSetting from "./mobile"
import PCAccountSetting from "./pc"

export const PersonalSetting: FC = () => {
  const { t } = useTranslation()
  const [accountLoading, setAccountLoading] = useState(false)
  const userInfo = useSelector(getCurrentUser)!
  const [updateNickName] = useUpdateNickNameMutation()
  const { uploadUserAvatar } = useUploadAvatar()
  const [updateUserAvatar] = useUpdateUserAvatarMutation()

  const { message } = App.useApp()
  const accountFormMethods = useForm<AccountSettingFields>({
    defaultValues: {
      nickname: userInfo.nickname,
    },
  })

  useEffect(() => {
    track(
      ILLA_MIXPANEL_EVENT_TYPE.VISIT,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.ACCOUNT_SETTING,
      {
        element: "account",
      },
    )
  }, [])

  const onAccountSubmit: SubmitHandler<AccountSettingFields> = async (data) => {
    try {
      setAccountLoading(true)
      await updateNickName(data.nickname)
      message.success(t("team_setting.message.save_suc"))
      accountFormMethods.reset({
        nickname: data.nickname,
      })
    } catch (e) {
    } finally {
      setAccountLoading(false)
    }
  }

  const handleUpdateAvatar = async (file: Blob) => {
    try {
      const icon = await uploadUserAvatar(file)
      await updateUserAvatar(icon)
      message.success(t("profile.setting.message.save_suc"))
      return true
    } catch (e) {
      message.error(t("profile.setting.message.save_fail"))
    }
    return false
  }

  return (
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.ACCOUNT_SETTING}
    >
      <FormProvider {...accountFormMethods}>
        <LayoutAutoChange
          desktopPage={
            <PCAccountSetting
              loading={accountLoading}
              onSubmit={onAccountSubmit}
              handleUpdateAvatar={handleUpdateAvatar}
            />
          }
          mobilePage={
            <MobileAccountSetting
              loading={accountLoading}
              onSubmit={onAccountSubmit}
              handleUpdateAvatar={handleUpdateAvatar}
            />
          }
        />
      </FormProvider>
    </MixpanelTrackProvider>
  )
}

PersonalSetting.displayName = "PersonalSetting"

export default PersonalSetting
