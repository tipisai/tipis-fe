import Icon from "@ant-design/icons"
import { App, Button, Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { AvatarUpload } from "@illa-public/cropper"
import { CameraIcon } from "@illa-public/icon"
import { USER_ROLE } from "@illa-public/public-types"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"
import ErrorMessage from "@/components/InputErrorMessage"
import { useUploadAvatar } from "@/page/SettingPage/hooks/uploadAvatar"
import { TEAM_IDENTIFY_FORMAT } from "@/page/SettingPage/team/info/constants"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { TeamInfoMobileProps } from "./interface"
import {
  cameraIconContainerStyle,
  forgotPwdContainerStyle,
  formLabelStyle,
  formStyle,
  gridFormFieldStyle,
  gridItemStyle,
  mobileSettingContainerStyle,
  uploadTeamLogoContainerStyle,
} from "./style"

const TeamInfoMobile: FC<TeamInfoMobileProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, disabled, loading } = props
  const { handleSubmit, control, formState, trigger } =
    useFormContext<TeamInfoFields>()
  const { message } = App.useApp()
  const teamInfo = useGetCurrentTeamInfo()!
  const { uploadTeamIcon } = useUploadAvatar()

  const handleUpdateTeamIcon = async (file: Blob) => {
    try {
      const icon = await uploadTeamIcon(file)
      return (await onSubmit?.({ icon })) as boolean
    } catch {
      message.error({
        content: t("profile.setting.message.save_fail"),
      })
      return false
    }
  }

  const validReport = async () => {
    let valid = await trigger()
    if (!valid) {
    } else {
    }
  }

  const canEditorTeamMobile = isBiggerThanTargetRole(
    USER_ROLE.OWNER,
    teamInfo?.myRole,
  )

  return (
    <div css={mobileSettingContainerStyle}>
      <AvatarUpload
        isMobile
        onOk={handleUpdateTeamIcon}
        disabled={!canEditorTeamMobile}
      >
        <div css={uploadTeamLogoContainerStyle}>
          <Icon component={CameraIcon} css={cameraIconContainerStyle} />
          <Avatar
            id={teamInfo?.id}
            name={teamInfo?.name}
            avatarUrl={teamInfo?.icon}
            size={100}
          />
        </div>
      </AvatarUpload>
      <form css={formStyle} onSubmit={handleSubmit(onSubmit)}>
        <section css={gridFormFieldStyle}>
          <section css={gridItemStyle}>
            <label css={formLabelStyle}>
              {t("team_setting.team_info.team_name")}
            </label>
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    disabled={disabled}
                    status={!!formState?.errors.name ? "error" : undefined}
                    variant="filled"
                    placeholder={t(
                      "team_setting.team_info.team_name_placeholder",
                    )}
                  />
                )}
                rules={{
                  required: t("team_setting.team_info.team_name_empty"),
                }}
              />
              {formState?.errors.name && (
                <ErrorMessage message={formState?.errors.name?.message} />
              )}
            </div>
          </section>
          <section css={gridItemStyle}>
            <div css={forgotPwdContainerStyle}>
              <label css={formLabelStyle}>
                {t("team_setting.team_info.team_domain")}
              </label>
            </div>
            <div>
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    disabled={disabled}
                    status={
                      !!formState?.errors.identifier ? "error" : undefined
                    }
                    variant="filled"
                    placeholder={t(
                      "team_setting.team_info.team_id_placeholder",
                    )}
                  />
                )}
                rules={{
                  required: t("team_setting.team_info.team_id_empty"),
                  pattern: {
                    value: TEAM_IDENTIFY_FORMAT,
                    message: t("homepage.team_modal.team_domain_invalid"),
                  },
                }}
              />
              {formState?.errors.identifier && (
                <ErrorMessage message={formState?.errors.identifier?.message} />
              )}
            </div>
          </section>
        </section>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={loading}
          disabled={disabled}
          block
          onClick={validReport}
        >
          {t("profile.setting.save")}
        </Button>
      </form>
    </div>
  )
}

export default TeamInfoMobile
