import { App } from "antd"
import { FC, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import { useChangeTeamConfigMutation } from "@illa-public/user-data"
import { isSmallThanTargetRole } from "@illa-public/user-role-utils"
import TeamInfoMobile from "@/page/SettingPage/team/info/components/TeamInfoMobile"
import TeamInfoPC from "@/page/SettingPage/team/info/components/TeamInfoPC"
import { TeamInfoFields } from "@/page/SettingPage/team/interface"
import { setLocalTeamIdentifier } from "@/utils/auth"
import { track } from "@/utils/mixpanelHelper"
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
    track(
      ILLA_MIXPANEL_EVENT_TYPE.VISIT,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
      { element: "team_setting" },
    )
  }, [])

  useEffect(() => {
    track(
      ILLA_MIXPANEL_EVENT_TYPE.SHOW,
      ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING,
      { element: "save_change" },
    )
  }, [disableEdit])

  return (
    <>
      <Helmet>
        <title>{t("team_setting.team_info.title")}</title>
      </Helmet>
      <MixpanelTrackProvider
        basicTrack={track}
        pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING}
      >
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
      </MixpanelTrackProvider>
    </>
  )
}

export default TeamInfo
