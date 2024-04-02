import { Avatar, Button, Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { AvatarUpload } from "@illa-public/cropper"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { getColorByString } from "@illa-public/utils"
import ErrorMessage from "@/components/InputErrorMessage"
import { Header } from "@/page/SettingPage/components/Header"
import { AccountSettingFields, AccountSettingProps } from "../interface"
import Logout from "./logout"
import {
  contentContainerStyle,
  editLabelStyle,
  formContainerStyle,
  formLabelStyle,
  gridItemStyle,
  tipTextStyle,
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
    <>
      <Header title={t("profile.setting.personal_info")} extra={<Logout />} />
      <div css={contentContainerStyle}>
        <div>
          <AvatarUpload onOk={handleUpdateAvatar}>
            <Avatar
              shape="circle"
              size={120}
              src={userInfo?.avatar}
              style={{
                fontSize: "60px",
                background: userInfo?.avatar
                  ? "#ffffff"
                  : getColorByString(userInfo?.userID || ""),
              }}
            >
              {userInfo?.nickname ? userInfo.nickname[0].toUpperCase() : "U"}
            </Avatar>

            <span css={editLabelStyle}>{t("editor.ai-agent.save")}</span>
          </AvatarUpload>
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
                onClick={validReport}
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
