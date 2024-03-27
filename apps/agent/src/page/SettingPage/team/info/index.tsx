import { App } from "antd"
import { FC, useEffect, useMemo, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { isILLAAPiError } from "@illa-public/illa-net"
import { LayoutAutoChange } from "@illa-public/layout-auto-change"
import {
  ILLA_MIXPANEL_CLOUD_PAGE_NAME,
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackProvider,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  useChangeTeamConfigMutation,
} from "@illa-public/user-data"
import { isSmallThanTargetRole } from "@illa-public/user-role-utils"
import MobileSetting from "@/page/SettingPage/team/info/components/TeamInfoMobile"
import Setting from "@/page/SettingPage/team/info/components/TeamInfoPC"
import {
  SettingContextType,
  TeamInfoFields,
} from "@/page/SettingPage/team/interface"
import { track } from "@/utils/mixpanelHelper"
import { getTeamInfoSetting } from "@/utils/routeHelper"

const TeamInfo: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { teamIdentifier } = useParams()
  const { onClickLeaveTeam } = useOutletContext<SettingContextType>()
  const teamInfo = useSelector(getCurrentTeamInfo)
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
    <MixpanelTrackProvider
      basicTrack={track}
      pageName={ILLA_MIXPANEL_CLOUD_PAGE_NAME.TEAM_SETTING}
    >
      <FormProvider {...settingFormProps}>
        <LayoutAutoChange
          desktopPage={
            <Setting
              disabled={disableEdit}
              loading={loading}
              onSubmit={onSubmit}
              teamInfo={teamInfo}
              onClickLeaveTeam={onClickLeaveTeam}
            />
          }
          mobilePage={
            <MobileSetting
              disabled={disableEdit}
              loading={loading}
              onSubmit={onSubmit}
            />
          }
        />
      </FormProvider>
    </MixpanelTrackProvider>
  )
}

export default TeamInfo
