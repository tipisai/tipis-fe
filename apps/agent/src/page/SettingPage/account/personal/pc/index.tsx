import { Avatar, Button, Input } from "antd"
import { FC, useContext, useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { AvatarUpload } from "@illa-public/cropper"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { useGetUserInfoQuery } from "@illa-public/user-data"
import { getColorByString } from "@illa-public/utils"
import ErrorMessage from "@/components/InputErrorMessage"
import { Header } from "@/page/SettingPage/components/Header"
import { getValidUserNameError } from "@/page/SettingPage/utils"
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
    formState: { isDirty, errors },
    getValues,
    trigger,
  } = useFormContext<AccountSettingFields>()

  const { data: userInfo } = useGetUserInfoQuery(null)

  const { track } = useContext(MixpanelTrackContext)
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
