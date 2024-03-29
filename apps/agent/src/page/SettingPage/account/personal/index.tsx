import { App } from "antd"
import { FC, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import {
  useGetUserInfoQuery,
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
  const { data } = useGetUserInfoQuery(null)
  const [updateNickName] = useUpdateNickNameMutation()
  const { uploadUserAvatar } = useUploadAvatar()
  const [updateUserAvatar] = useUpdateUserAvatarMutation()

  const { message } = App.useApp()
  const accountFormMethods = useForm<AccountSettingFields>({
    values: {
      nickname: data!.nickname,
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
      updateNickName(data.nickname)
      message.success(t("team_setting.message.save_suc"))
      accountFormMethods.reset({
        nickname: data.nickname,
      })
    } catch (e) {}
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
    <>
      <Helmet>
        <title>{t("profile.setting.personal_info")}</title>
      </Helmet>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.ACCOUNT_SETTING}
      >
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
      </MixpanelTrackProvider>
    </>
  )
}

PersonalSetting.displayName = "PersonalSetting"

export default PersonalSetting
