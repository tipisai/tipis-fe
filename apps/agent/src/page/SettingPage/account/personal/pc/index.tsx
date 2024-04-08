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
import { Header } from "@/page/SettingPage/components/Header"
import { AccountSettingFields, AccountSettingProps } from "../interface"
import Logout from "./logout"
import {
  contentContainerStyle,
  formContainerStyle,
  formLabelStyle,
  gridItemStyle,
  tipTextStyle,
  uploadContentContainerStyle,
} from "./style"
import { gridFormFieldStyle } from "./style"

const PCAccountSetting: FC<AccountSettingProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, handleUpdateAvatar } = props
  const {
    handleSubmit,
    control,
    formState,
    formState: { isDirty },
  } = useFormContext<AccountSettingFields>()

  const { message } = App.useApp()

  const { data: userInfo } = useGetUserInfoQuery(null)

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
    <>
      <Header title={t("profile.setting.personal_info")} extra={<Logout />} />
      <div css={contentContainerStyle}>
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
              <Upload
                listType="picture-circle"
                showUploadList={false}
                customRequest={() => {}}
              >
                {userInfo?.avatar ? (
                  <Image
                    src={userInfo?.avatar}
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    css={uploadContentContainerStyle}
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

        <form onSubmit={handleSubmit?.(onSubmit)} css={formContainerStyle}>
          <section css={gridFormFieldStyle}>
            <section css={gridItemStyle}>
              <label css={formLabelStyle}>
                {t("profile.setting.username")}
              </label>
              <div>
                <Controller
                  name="nickname"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      size="large"
                      status={
                        !!formState?.errors.nickname ? "error" : undefined
                      }
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
            <section css={gridItemStyle}>
              <label css={formLabelStyle}>
                {t("profile.setting.email")}
                <span css={tipTextStyle}>
                  {t("profile.setting.uneditable")}
                </span>
              </label>
              <div>
                <Input
                  size="large"
                  value={userInfo?.email}
                  disabled
                  variant="filled"
                  placeholder={userInfo?.email}
                />
              </div>
            </section>
            <span>
              <Button
                type="primary"
                size="large"
                disabled={!isDirty}
                htmlType="submit"
              >
                {t("profile.setting.save")}
              </Button>
            </span>
          </section>
        </form>
      </div>
    </>
  )
}

PCAccountSetting.displayName = "AccountSetting"

export default PCAccountSetting
