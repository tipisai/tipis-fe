import { Button, Input } from "antd"
import { FC, useMemo } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import ErrorMessage from "@/components/InputErrorMessage"
import { ChangePasswordProps, IChangePasswordFields } from "../interface"
import { controllerContainerStyle, formContainerStyle } from "./style"

const { Password } = Input

const ChangePasswordMobile: FC<ChangePasswordProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, loading } = props
  const { handleSubmit, control, formState, getValues, watch, trigger } =
    useFormContext<IChangePasswordFields>()

  const { currentPassword, newPassword, confirmPassword } = watch()

  const disabled = useMemo(() => {
    return !(currentPassword && newPassword && confirmPassword)
  }, [currentPassword, newPassword, confirmPassword])

  const validReport = async () => {
    let valid = await trigger()
    if (!valid) {
    } else {
    }
  }

  return (
    <form onSubmit={handleSubmit?.(onSubmit)} css={formContainerStyle}>
      <section css={controllerContainerStyle}>
        <label>{t("profile.setting.current_pwd")}</label>
        <div>
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                size="large"
                status={
                  !!formState?.errors.currentPassword ? "error" : undefined
                }
                variant="filled"
                placeholder={t("profile.setting.password_placeholder")}
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
      <section css={controllerContainerStyle}>
        <label>{t("profile.setting.new_pwd")}</label>
        <div>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                size="large"
                status={!!formState?.errors.newPassword ? "error" : undefined}
                variant="filled"
                placeholder={t("profile.setting.new_password_placeholder")}
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
            <ErrorMessage message={formState?.errors.newPassword?.message} />
          )}
        </div>
      </section>
      <section css={controllerContainerStyle}>
        <label>{t("profile.setting.confirm_pwd")}</label>
        <div>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Password
                {...field}
                size="large"
                status={
                  !!formState?.errors.confirmPassword ? "error" : undefined
                }
                variant="filled"
                placeholder={t(
                  "profile.setting.new_password_again_placeholder",
                )}
              />
            )}
            rules={{
              validate: (value) =>
                value === getValues?.("newPassword") ||
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
      <Button
        size="large"
        loading={loading}
        disabled={disabled}
        htmlType="submit"
        block
        type="primary"
        onClick={validReport}
      >
        {t("profile.setting.save")}
      </Button>
    </form>
  )
}

export default ChangePasswordMobile
