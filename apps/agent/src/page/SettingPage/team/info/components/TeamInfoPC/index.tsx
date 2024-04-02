import { App, Button, Input } from "antd"
import { FC } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Avatar } from "@illa-public/avatar"
import { AvatarUpload } from "@illa-public/cropper"
import { USER_ROLE } from "@illa-public/public-types"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"
import ErrorMessage from "@/components/InputErrorMessage"
import { Header } from "@/page/SettingPage/components/Header"
import { useUploadAvatar } from "@/page/SettingPage/hooks/uploadAvatar"
import { useLeaveTeamModal } from "@/page/SettingPage/hooks/useLeaveTeamModal"
import { TEAM_IDENTIFY_FORMAT } from "@/page/SettingPage/team/info/constants"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { TeamInfoPCProps } from "./interface"
import {
  avatarStyle,
  editLabelStyle,
  forgotPwdContainerStyle,
  formLabelStyle,
  formStyle,
  formTitleStyle,
  gridFormFieldStyle,
  gridItemStyle,
  leaveLabelStyle,
  settingWrapperStyle,
} from "./style"

const TeamInfoPC: FC<TeamInfoPCProps> = (props) => {
  const { t } = useTranslation()
  const { message } = App.useApp()
  const { onSubmit, loading, disabled } = props
  const { handleSubmit, control, formState, trigger } =
    useFormContext<TeamInfoFields>()
  const teamInfo = useGetCurrentTeamInfo()!
  const handleLeaveOrDeleteTeamModal = useLeaveTeamModal()

  const { uploadTeamIcon } = useUploadAvatar()

  const isOwner = teamInfo?.myRole === USER_ROLE.OWNER

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

  const handleClickLeave = () => {
    handleLeaveOrDeleteTeamModal()
  }

  return (
    <>
      <Header title={t("team_setting.team_info.title")} />
      <div css={settingWrapperStyle}>
        <div>
          <AvatarUpload
            onOk={handleUpdateTeamIcon}
            disabled={!canEditorTeamMobile}
          >
            <Avatar
              css={avatarStyle}
              id={teamInfo?.id}
              name={teamInfo?.name}
              avatarUrl={teamInfo?.icon}
              onClick={() => {
                if (!canEditorTeamMobile) return
              }}
            />
            {canEditorTeamMobile && (
              <span css={editLabelStyle}>{t("editor.ai-agent.save")}</span>
            )}
          </AvatarUpload>
        </div>
        <form css={formStyle} onSubmit={handleSubmit?.(onSubmit)}>
          <header css={formTitleStyle}>
            {t("team_setting.team_info.title")}
          </header>
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
                      autoComplete="new-name"
                      size="large"
                      disabled={disabled}
                      status={!!formState?.errors.name ? "error" : undefined}
                      variant="filled"
                      placeholder={t(
                        "team_setting.team_info.team_name_placeholder",
                      )}
                      onFocus={() => {}}
                      onBlur={() => {}}
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
                      onFocus={() => {}}
                      onBlur={() => {}}
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
                  <ErrorMessage
                    message={formState?.errors.identifier?.message}
                  />
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
            onClick={validReport}
          >
            {t("team_setting.team_info.save")}
          </Button>
          <div>
            <div css={leaveLabelStyle}>
              {isOwner
                ? t("team_setting.left_panel.delete")
                : t("team_setting.left_panel.leave")}
            </div>
            <Button
              danger
              type="primary"
              size="large"
              onClick={handleClickLeave}
            >
              {isOwner
                ? t("team_setting.left_panel.delete")
                : t("team_setting.left_panel.leave")}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default TeamInfoPC
