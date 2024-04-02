import { App } from "antd"
import { FC, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBeforeUnload, useNavigate, useParams } from "react-router-dom"
import { isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import { USER_ROLE } from "@illa-public/public-types"
import {
  TIPIS_TRACK_CLOUD_PAGE_NAME,
  TipisTrack,
} from "@illa-public/track-utils"
import { useChangeTeamConfigMutation } from "@illa-public/user-data"
import { isSmallThanTargetRole } from "@illa-public/user-role-utils"
import TeamInfoMobile from "@/page/SettingPage/team/info/components/TeamInfoMobile"
import TeamInfoPC from "@/page/SettingPage/team/info/components/TeamInfoPC"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"
import { setLocalTeamIdentifier } from "@/utils/auth"
import { getTeamInfoSetting } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"

const TeamInfo: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { teamIdentifier } = useParams()
  const teamInfo = useGetCurrentTeamInfo()!
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  const [changeTeamConfig] = useChangeTeamConfigMutation()

  const settingFormProps = useForm<TeamInfoFields>({
    values: {
      name: teamInfo?.name,
      identifier: teamInfo?.identifier,
    },
  })

  const disableEdit = useMemo(() => {
    return teamInfo && isSmallThanTargetRole(USER_ROLE.ADMIN, teamInfo?.myRole)
  }, [teamInfo])

  const onSubmit: SubmitHandler<TeamInfoFields> = async (data) => {
    try {
      setLoading(true)
      await changeTeamConfig({
        data,
        teamID: teamInfo?.id as string,
      })
      message.success({
        content: t("team_setting.message.save_suc"),
      })
      settingFormProps.reset({
        name: data.name,
        identifier: data.identifier,
      })
      if (data.identifier && data.identifier !== teamIdentifier) {
        setLocalTeamIdentifier(data.identifier)
        navigate(getTeamInfoSetting(data.identifier))
      }
      return true
    } catch (e) {
      if (isILLAAPiError(e)) {
        message.error({
          content: `${t("team_setting.message.save_fail")}:${
            e.data.errorMessage
          }`,
        })
        return false
      }
      message.error({
        content: t("team_setting.message.save_fail"),
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    TipisTrack.pageViewTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_INFO)
    return () => {
      TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_INFO)
    }
  }, [])

  useBeforeUnload(() => {
    TipisTrack.pageLeaveTrack(TIPIS_TRACK_CLOUD_PAGE_NAME.SETTING_INFO)
  })

  return (
    <>
      <Helmet>
        <title>{t("team_setting.team_info.title")}</title>
      </Helmet>

      <FormProvider {...settingFormProps}>
        <LayoutAutoChange
          desktopPage={
            <TeamInfoPC
              disabled={disableEdit}
              loading={loading}
              onSubmit={onSubmit}
              teamInfo={teamInfo}
            />
          }
          mobilePage={
            <TeamInfoMobile
              disabled={disableEdit}
              loading={loading}
              onSubmit={onSubmit}
            />
          }
        />
      </FormProvider>
    </>
  )
}

export default TeamInfo
