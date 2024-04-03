import {
  App,
  Avatar,
  Button,
  ConfigProvider,
  GetProp,
  Image,
  Input,
  Upload,
  UploadProps,
} from "antd"
import ImgCrop from "antd-img-crop"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { FILE_SIZE_LIMIT } from "@illa-public/cropper/constants"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { getColorByString } from "@illa-public/utils"
import ErrorMessage from "@/components/InputErrorMessage"
import { AccountSettingFields, AccountSettingProps } from "../interface"
import {
  avatarContainerStyle,
  containerStyle,
  controllerContainerStyle,
  formContainerStyle,
  formLabelStyle,
  tipTextStyle,
  uploadContentContainerStyle,
} from "./style"

const MobileAccountSetting: FC<AccountSettingProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, handleUpdateAvatar } = props
  const {
    handleSubmit,
    control,
    formState,
    formState: { isDirty },
  } = useFormContext<AccountSettingFields>()
  const { data: userInfo } = useGetUserInfoQuery(null)

  const { message } = App.useApp()

  const handleBeforeUpload = (
    file: Parameters<GetProp<UploadProps, "beforeUpload">>[0],
  ) => {
    if (file.size >= FILE_SIZE_LIMIT) {
      message.error(t("image_exceed"))
      return false
    }
    return true
  }

  return (
    <div css={containerStyle}>
      <div css={avatarContainerStyle}>
        <div>
          <ConfigProvider
            theme={{
              token: {
                controlHeightLG: 47,
              },
            }}
          >
            <ImgCrop
              rotationSlider
              onModalOk={(v) => {
                handleUpdateAvatar(v as File)
              }}
              beforeCrop={handleBeforeUpload}
              cropShape="round"
            >
              <Upload listType="picture-circle" showUploadList={false}>
                {userInfo?.avatar ? (
                  <Image
                    src={userInfo?.avatar}
                    css={uploadContentContainerStyle}
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    preview={{
                      visible: false,
                      mask: "+ Upload",
                    }}
                  />
                ) : (
                  <Avatar
                    src={userInfo?.nickname}
                    shape="circle"
                    size={120}
                    style={{
                      fontSize: 36,
                      background: userInfo?.avatar
                        ? "#ffffff"
                        : getColorByString(userInfo?.userID || ""),
                    }}
                  >
                    {userInfo?.nickname[0]
                      ? userInfo.nickname[0].toLocaleUpperCase()
                      : "U"}
                  </Avatar>
                )}
              </Upload>
            </ImgCrop>
          </ConfigProvider>
        </div>
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
        <Button type="primary" size="large" disabled={!isDirty} block>
          {t("profile.setting.save")}
        </Button>
      </form>
    </div>
  )
}

MobileAccountSetting.displayName = "AccountSettingMobile"

export default MobileAccountSetting
