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
import { USER_ROLE } from "@illa-public/public-types"
import { isBiggerThanTargetRole } from "@illa-public/user-role-utils"
import { getColorByString } from "@illa-public/utils"
import ErrorMessage from "@/components/InputErrorMessage"
import { FILE_SIZE_LIMIT } from "@/page/SettingPage/constants"
import { useUploadAvatar } from "@/page/SettingPage/hooks/uploadAvatar"
import { TEAM_IDENTIFY_FORMAT } from "@/page/SettingPage/team/info/constants"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"
import { useGetCurrentTeamInfo } from "@/utils/team"
import { TeamInfoMobileProps } from "./interface"
import {
  forgotPwdContainerStyle,
  formLabelStyle,
  formStyle,
  gridFormFieldStyle,
  gridItemStyle,
  mobileSettingContainerStyle,
  uploadContentContainerStyle,
  uploadTeamLogoContainerStyle,
} from "./style"

const TeamInfoMobile: FC<TeamInfoMobileProps> = (props) => {
  const { t } = useTranslation()
  const { onSubmit, disabled, loading } = props
  const { handleSubmit, control, formState } = useFormContext<TeamInfoFields>()
  const { message } = App.useApp()
  const teamInfo = useGetCurrentTeamInfo()!
  const { uploadTeamIcon } = useUploadAvatar()

  const handleUpdateTeamIcon = async (file: File) => {
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

  const handleBeforeUpload = (
    file: Parameters<GetProp<UploadProps, "beforeUpload">>[0],
  ) => {
    if (file.size >= FILE_SIZE_LIMIT) {
      message.error(t("image_exceed"))
      return false
    }
    return true
  }

  const canEditorTeamInfo = isBiggerThanTargetRole(
    USER_ROLE.OWNER,
    teamInfo?.myRole,
  )

  return (
    <div css={mobileSettingContainerStyle}>
      <div css={uploadTeamLogoContainerStyle}>
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
                handleUpdateTeamIcon(v as File)
              }}
              beforeCrop={handleBeforeUpload}
              cropShape="round"
            >
              <Upload
                listType="picture-circle"
                showUploadList={false}
                disabled={!canEditorTeamInfo}
                customRequest={() => {}}
              >
                {teamInfo?.icon ? (
                  <Image
                    src={teamInfo?.icon}
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    css={uploadContentContainerStyle}
                    preview={
                      canEditorTeamInfo
                        ? {
                            visible: false,
                            mask: "+ Upload",
                          }
                        : false
                    }
                  />
                ) : (
                  <Avatar
                    src={teamInfo?.name}
                    shape="circle"
                    size={120}
                    style={{
                      fontSize: 36,
                      background: teamInfo?.name
                        ? "#ffffff"
                        : getColorByString(teamInfo?.id || ""),
                    }}
                  >
                    {teamInfo?.name[0]
                      ? teamInfo.name[0].toLocaleUpperCase()
                      : "T"}
                  </Avatar>
                )}
              </Upload>
            </ImgCrop>
          </ConfigProvider>
        </div>
      </div>
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
        >
          {t("profile.setting.save")}
        </Button>
      </form>
    </div>
  )
}

export default TeamInfoMobile
