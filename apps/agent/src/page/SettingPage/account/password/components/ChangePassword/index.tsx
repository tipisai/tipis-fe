import { App } from "antd"
import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { useUpdateUserPasswordMutation } from "@illa-public/user-data"
import { IChangePasswordFields } from "./interface"
import ChangePasswordMobile from "./mobile"
import ChangePasswordPC from "./pc"

const ChangePassword: FC = () => {
  const changePasswordForm = useForm<IChangePasswordFields>()
  const [updateUserPassword] = useUpdateUserPasswordMutation()
  const [changePasswordLoading, setChangePasswordLoading] = useState(false)
  const { message } = App.useApp()
  const { t } = useTranslation()

  const onChangePasswordFormSubmit: SubmitHandler<
    IChangePasswordFields
  > = async (data) => {
    try {
      setChangePasswordLoading(true)
      await updateUserPassword(data)
      message.success(t("team_setting.message.save_suc"))
      changePasswordForm.reset()
    } catch (e) {
      if (isILLAAPiError(e)) {
      }
    } finally {
      setChangePasswordLoading(false)
    }
  }
  return (
    <FormProvider {...changePasswordForm}>
      <LayoutAutoChange
        desktopPage={
          <ChangePasswordPC
            loading={changePasswordLoading}
            onSubmit={onChangePasswordFormSubmit}
          />
        }
        mobilePage={
          <ChangePasswordMobile
            loading={changePasswordLoading}
            onSubmit={onChangePasswordFormSubmit}
          />
        }
      />
    </FormProvider>
  )
}

export default ChangePassword
