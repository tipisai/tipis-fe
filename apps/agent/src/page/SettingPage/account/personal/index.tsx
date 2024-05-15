import { App } from "antd"
import { FC, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBeforeUnload } from "react-router-dom"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import {
  useGetUserInfoQuery,
  useUpdateUserProfileMutation,
} from "@illa-public/user-data"
import { useUploadAvatar } from "./hooks"
import { AccountSettingFields } from "./interface"
import MobileAccountSetting from "./mobile"
import PCAccountSetting from "./pc"

export const PersonalSetting: FC = () => {
  const { t } = useTranslation()
  const { data } = useGetUserInfoQuery(null)
  const [updateUserProfile] = useUpdateUserProfileMutation()
  const uploadAvatar = useUploadAvatar()

  const { message } = App.useApp()
  const accountFormMethods = useForm<AccountSettingFields>({
    values: {
      nickname: data!.nickname,
    },
  })

  const onAccountSubmit: SubmitHandler<AccountSettingFields> = async (data) => {
    try {
      updateUserProfile({
        nickname: data.nickname,
      })
      message.success(t("team_setting.message.save_suc"))
      accountFormMethods.reset({
        nickname: data.nickname,
      })
    } catch (e) {}
  }

  const handleUpdateAvatar = async (file: File) => {
    try {
      const avatarUrl = await uploadAvatar(file)
      await updateUserProfile({
        avatarUrl,
      })
      message.success(t("profile.setting.message.save_suc"))
      return true
    } catch (e) {
      message.error(t("profile.setting.message.save_fail"))
    }
    return false
  }

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_ACCOUNT)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_ACCOUNT)
    }
  }, [])

  useBeforeUnload(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_ACCOUNT)
  })

  return (
    <>
      <Helmet>
        <title>{t("profile.setting.personal_info")}</title>
      </Helmet>
      <FormProvider {...accountFormMethods}>
        <LayoutAutoChange
          desktopPage={
            <PCAccountSetting
              onSubmit={onAccountSubmit}
              handleUpdateAvatar={handleUpdateAvatar}
            />
          }
          mobilePage={
            <MobileAccountSetting
              onSubmit={onAccountSubmit}
              handleUpdateAvatar={handleUpdateAvatar}
            />
          }
        />
      </FormProvider>
    </>
  )
}

PersonalSetting.displayName = "PersonalSetting"

export default PersonalSetting
