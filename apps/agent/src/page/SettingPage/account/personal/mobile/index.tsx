import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC, useContext, useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Avatar } from "@illa-public/avatar"
import { AvatarUpload } from "@illa-public/cropper"
import { CameraIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { getCurrentUser } from "@illa-public/user-data"
import ErrorMessage from "@/components/InputErrorMessage"
import SettingMobileLayout from "@/page/SettingPage/layout/mobile"
import { getValidUserNameError } from "@/page/SettingPage/utils"
import { AccountSettingFields, AccountSettingProps } from "../interface"
import {
  avatarContainerStyle,
  cameraIconContainerStyle,
  containerStyle,
  controllerContainerStyle,
  formContainerStyle,
  formLabelStyle,
  tipTextStyle,
} from "./style"

const MobileAccountSetting: FC<AccountSettingProps> = (props) => {
  const { t } = useTranslation()
  const { track } = useContext(MixpanelTrackContext)
  const { onSubmit, loading, handleUpdateAvatar } = props
  const {
    handleSubmit,
    control,
    formState,
    formState: { isDirty, errors },
    getValues,
    trigger,
  } = useFormContext<AccountSettingFields>()
  const userInfo = useSelector(getCurrentUser)

  const validReport = async () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "save_change",
      parameter1: "username",
    })
    let valid = await trigger()
    if (!valid) {
      track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
        element: "save_change",
        parameter1: "username",
        parameter2: "failed",
        parameter3: getValidUserNameError(errors.nickname?.type),
      })
    } else {
      track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
        element: "save_change",
        parameter1: "username",
        parameter2: "suc",
      })
    }
  }

  useEffect(() => {
    track(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
      element: "save_change",
      parameter2: "username",
      parameter3: isDirty ? "not_disable" : "disable",
    })
  }, [isDirty, track])
  return (
    <SettingMobileLayout>
      <div css={containerStyle}>
        <div css={avatarContainerStyle}>
          <AvatarUpload isMobile onOk={handleUpdateAvatar}>
            <div css={cameraIconContainerStyle}>
              <Icon component={CameraIcon} />
            </div>
            <Avatar
              size={100}
              id={userInfo?.userID}
              name={userInfo?.nickname}
              avatarUrl={userInfo?.avatar}
              onClick={() =>
                track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
                  element: "avatar",
                })
              }
            />
          </AvatarUpload>
        </div>
        <form onSubmit={handleSubmit?.(onSubmit)} css={formContainerStyle}>
          <section css={controllerContainerStyle}>
            <label css={formLabelStyle}>{t("profile.setting.username")}</label>
            <div>
              <Controller
                name="nickname"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    status={!!formState?.errors.nickname ? "error" : undefined}
                    variant="filled"
                    placeholder={t("profile.setting.username")}
                    onFocus={() => {
                      track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                        element: "username",
                        parameter2: getValues().nickname?.length ?? 0,
                      })
                    }}
                    onBlur={() => {
                      track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                        element: "username",
                        parameter2: getValues().nickname?.length ?? 0,
                      })
                    }}
                  />
                )}
                rules={{
                  required: t("profile.setting.username_empty"),
                  maxLength: {
                    value: 15,
                    message: t("profile.setting.username_length"),
                  },
                  minLength: {
                    value: 3,
                    message: t("profile.setting.username_length"),
                  },
                }}
              />
              {formState?.errors.nickname && (
                <ErrorMessage message={formState?.errors.nickname?.message} />
              )}
            </div>
          </section>
          <section css={controllerContainerStyle}>
            <label css={formLabelStyle}>
              {t("profile.setting.email")}
              <span css={tipTextStyle}> {t("profile.setting.uneditable")}</span>
            </label>
            <div>
              <Input
                disabled
                size="large"
                variant="filled"
                value={userInfo.email}
                placeholder={t("profile.setting.new_password_placeholder")}
              />
            </div>
          </section>
          <Button
            type="primary"
            size="large"
            loading={loading}
            disabled={!isDirty}
            block
            onClick={validReport}
          >
            {t("profile.setting.save")}
          </Button>
        </form>
      </div>
    </SettingMobileLayout>
  )
}

MobileAccountSetting.displayName = "AccountSettingMobile"

export default MobileAccountSetting
