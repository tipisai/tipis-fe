import Icon from "@ant-design/icons"
import { App, Button, Input } from "antd"
import { FC, useContext } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Avatar } from "@illa-public/avatar"
import { AvatarUpload } from "@illa-public/cropper"
import { CameraIcon } from "@illa-public/icon"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import { getCurrentTeamInfo } from "@illa-public/user-data"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"
import { useUploadAvatar } from "@/page/SettingPage/hooks/uploadAvatar"
import { MobileSettingProps } from "@/page/SettingPage/team/info/components/MobileSetting/interface"
import { TEAM_IDENTIFY_FORMAT } from "@/page/SettingPage/team/info/constants"
import { TeamSettingFields } from "@/page/SettingPage/team/interface"
import { getValidTeamSettingError } from "@/page/SettingPage/utils"
import {
  cameraIconContainerStyle,
  errorMsgStyle,
  forgotPwdContainerStyle,
  formLabelStyle,
  formStyle,
  gridFormFieldStyle,
  gridItemStyle,
  mobileSettingContainerStyle,
  uploadTeamLogoContainerStyle,
} from "./style"

const MobileSetting: FC<MobileSettingProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, errorMsg, disabled, loading } = props
  const { handleSubmit, control, formState, getValues, trigger } =
    useFormContext<TeamSettingFields>()
  const { message } = App.useApp()
  const currentTeamInfo = useSelector(getCurrentTeamInfo)!
  const { uploadTeamIcon } = useUploadAvatar()
  const { track } = useContext(MixpanelTrackContext)

  const { errors } = formState

  const handleUpdateTeamIcon = async (file: Blob) => {
    try {
      const icon = await uploadTeamIcon(file)
      return (await onSubmit?.({ icon })) as boolean
    } catch {
      console.error("upload team icon failed")
      message.error({
        content: t("profile.setting.message.save_fail"),
      })
      return false
    }
  }

  const validReport = async () => {
    track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "save_change",
    })
    let valid = await trigger()
    if (!valid) {
      track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
        element: "save_change",
        parameter2: "failed",
        parameter3: getValidTeamSettingError(errors),
      })
    } else {
      track(ILLA_MIXPANEL_EVENT_TYPE.VALIDATE, {
        element: "save_change",
        parameter2: "suc",
      })
    }
  }

  const canEditorTeamMobile = isBiggerThanTargetRole(
    USER_ROLE.OWNER,
    currentTeamInfo?.myRole,
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
            id={currentTeamInfo?.id}
            name={currentTeamInfo?.name}
            avatarUrl={currentTeamInfo?.icon}
            size={100}
            onClick={() => {
              if (!canEditorTeamMobile) return
              track(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
                element: "avatar",
              })
            }}
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
                    status={
                      !!formState?.errors.name || !!errorMsg.name
                        ? "error"
                        : undefined
                    }
                    variant="filled"
                    placeholder={t(
                      "team_setting.team_info.team_name_placeholder",
                    )}
                    onFocus={() => {
                      track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                        element: "team_name",
                        parameter2: getValues().name?.length ?? 0,
                      })
                    }}
                    onBlur={() => {
                      track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                        element: "team_name",
                        parameter2: getValues().name?.length ?? 0,
                      })
                    }}
                  />
                )}
                rules={{
                  required: t("team_setting.team_info.team_name_empty"),
                }}
              />
              {(formState?.errors.name || errorMsg.name) && (
                <div css={errorMsgStyle}>
                  {formState?.errors.name?.message || errorMsg.name}
                </div>
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
                      !!formState?.errors.identifier || !!errorMsg.identifier
                        ? "error"
                        : undefined
                    }
                    variant="filled"
                    placeholder={t(
                      "team_setting.team_info.team_id_placeholder",
                    )}
                    onFocus={() => {
                      track(ILLA_MIXPANEL_EVENT_TYPE.FOCUS, {
                        element: "team_identify",
                        parameter2: getValues().identifier?.length ?? 0,
                      })
                    }}
                    onBlur={() => {
                      track(ILLA_MIXPANEL_EVENT_TYPE.BLUR, {
                        element: "team_identify",
                        parameter2: getValues().identifier?.length ?? 0,
                      })
                    }}
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
              {(formState?.errors.identifier || errorMsg.identifier) && (
                <div css={errorMsgStyle}>
                  {formState?.errors.identifier?.message || errorMsg.identifier}
                </div>
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

MobileSetting.displayName = "MobileSetting"

export default MobileSetting
