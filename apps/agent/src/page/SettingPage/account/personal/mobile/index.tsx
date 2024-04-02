import Icon from "@ant-design/icons"
import { Button, Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { AvatarUpload } from "@illa-public/cropper"
import { CameraIcon } from "@illa-public/icon"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import ErrorMessage from "@/components/InputErrorMessage"
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
  const { onSubmit, handleUpdateAvatar } = props
  const {
    handleSubmit,
    control,
    formState,
    formState: { isDirty },
    trigger,
  } = useFormContext<AccountSettingFields>()
  const { data: userInfo } = useGetUserInfoQuery(null)

  const validReport = async () => {
    let valid = await trigger()
    if (!valid) {
    } else {
    }
  }

  return (
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
              value={userInfo?.email}
              placeholder={t("profile.setting.new_password_placeholder")}
            />
          </div>
        </section>
        <Button
          type="primary"
          size="large"
          disabled={!isDirty}
          block
          onClick={validReport}
        >
          {t("profile.setting.save")}
        </Button>
      </form>
    </div>
  )
}

MobileAccountSetting.displayName = "AccountSettingMobile"

export default MobileAccountSetting
