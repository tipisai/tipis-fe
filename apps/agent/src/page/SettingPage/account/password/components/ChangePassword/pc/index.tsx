import { Button, Input } from "antd"
import { FC, useContext, useEffect, useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import ErrorMessage from "@/components/InputErrorMessage"
import { Header } from "@/page/SettingPage/components/Header"
import { getValidPasswordErr } from "@/page/SettingPage/utils"
import { ChangePasswordProps, IChangePasswordFields } from "../interface"
import {
  formLabelStyle,
  gridFormFieldStyle,
  innerContainerStyle,
} from "./style"
import { gridItemStyle, passwordFormContainerStyle } from "./style"

const { Password } = Input

const ChangePasswordPC: FC<ChangePasswordProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, loading } = props

  const { handleSubmit, control, formState, getValues, watch, trigger } =
    useFormContext<IChangePasswordFields>()
  const { errors } = formState

  const { track } = useContext(MixpanelTrackContext)

  const { currentPassword, newPassword, confirmPassword } = watch()

  const disabled = useMemo(() => {
    return !(currentPassword && newPassword && confirmPassword)
  }, [currentPassword, newPassword, confirmPassword])

  const validReport = async () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "save_change",
      parameter1: "password",
    })
    let valid = await trigger()
    if (!valid) {
      track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
        element: "save_change",
        parameter1: "password",
        parameter2: "failed",
        parameter3: getValidPasswordErr(errors),
      })
    } else {
      track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
        element: "save_change",
        parameter1: "password",
        parameter2: "suc",
      })
    }
  }

  useEffect(() => {
    track(ILLA_MIXPANEL_EVENT_TYPE.SHOW, {
      element: "save_change",
      parameter2: "password",
      parameter3: disabled ? "disable" : "not_disable",
    })
  }, [disabled, track])

  return (
    <>
      <Header title={t("profile.setting.password.title")} />
      <div css={innerContainerStyle}>
        <form
          onSubmit={handleSubmit?.(onSubmit)}
          css={passwordFormContainerStyle}
        >
          <section css={gridFormFieldStyle}>
            <section css={gridItemStyle}>
              <label css={formLabelStyle}>
                {t("profile.setting.current_pwd")}
              </label>
              <div>
                <Controller
                  name="currentPassword"
                  control={control}
                  render={({ field }) => (
                    <Password
                      {...field}
                      size="large"
                      status={
                        !!formState?.errors.currentPassword
                          ? "error"
                          : undefined
                      }
                      variant="filled"
                      placeholder={t("profile.setting.password_placeholder")}
                      onFocus={() => {
                        track(
                          ILLA_MIXPANEL_EVENT_TYPE.FOCUS,

                          {
                            element: "current_password",
                            parameter2:
                              getValues().currentPassword?.length ?? 0,
                          },
                        )
                      }}
                      onBlur={() => {
                        track(
                          ILLA_MIXPANEL_EVENT_TYPE.BLUR,

                          {
                            element: "current_password",
                            parameter2:
                              getValues().currentPassword?.length ?? 0,
                          },
                        )
                      }}
                    />
                  )}
                  rules={{
                    required: t("profile.setting.password_empty"),
                    minLength: {
                      value: 6,
                      message: t("profile.setting.password_length"),
                    },
                    maxLength: {
                      value: 20,
                      message: t("profile.setting.password_length"),
                    },
                  }}
                />
                {formState?.errors.currentPassword && (
                  <ErrorMessage
                    message={formState?.errors.currentPassword?.message}
                  />
                )}
              </div>
            </section>
            <section css={gridItemStyle}>
              <label css={formLabelStyle}>{t("profile.setting.new_pwd")}</label>
              <div>
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <Password
                      {...field}
                      size="large"
                      status={
                        !!formState?.errors.newPassword ? "error" : undefined
                      }
                      variant="filled"
                      placeholder={t(
                        "profile.setting.new_password_placeholder",
                      )}
                      onFocus={() => {
                        track(
                          ILLA_MIXPANEL_EVENT_TYPE.FOCUS,

                          {
                            element: "new_password",
                            parameter2: getValues().newPassword?.length ?? 0,
                          },
                        )
                      }}
                      onBlur={() => {
                        track(
                          ILLA_MIXPANEL_EVENT_TYPE.BLUR,

                          {
                            element: "new_password",
                            parameter2: getValues().newPassword?.length ?? 0,
                          },
                        )
                      }}
                    />
                  )}
                  rules={{
                    required: t("profile.setting.new_password_empty"),
                    minLength: {
                      value: 6,
                      message: t("profile.setting.password_length"),
                    },
                    maxLength: {
                      value: 20,
                      message: t("profile.setting.password_length"),
                    },
                  }}
                />
                {formState?.errors.newPassword && (
                  <ErrorMessage
                    message={formState?.errors.newPassword?.message}
                  />
                )}
              </div>
            </section>
            <section css={gridItemStyle}>
              <label css={formLabelStyle}>
                {t("profile.setting.confirm_pwd")}
              </label>
              <div>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Password
                      {...field}
                      size="large"
                      status={
                        !!formState?.errors.confirmPassword
                          ? "error"
                          : undefined
                      }
                      variant="filled"
                      placeholder={t(
                        "profile.setting.new_password_again_placeholder",
                      )}
                      onFocus={() => {
                        track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                          element: "confirm_password",
                          parameter2: getValues().confirmPassword?.length ?? 0,
                        })
                      }}
                      onBlur={() => {
                        track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                          element: "confirm_password",
                          parameter2: getValues().confirmPassword?.length ?? 0,
                        })
                      }}
                    />
                  )}
                  rules={{
                    validate: (value) =>
                      value === newPassword ||
                      t("profile.setting.password_not_match"),
                  }}
                />
                {formState?.errors.confirmPassword && (
                  <ErrorMessage
                    message={formState?.errors.confirmPassword?.message}
                  />
                )}
              </div>
            </section>
            <span>
              <Button
                type="primary"
                size="large"
                loading={loading}
                disabled={disabled}
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

export default ChangePasswordPC
