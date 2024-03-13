import { App } from "antd"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
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
  teamActions,
  useChangeTeamConfigMutation,
} from "@illa-public/user-data"
import { isSmallThanTargetRole } from "@illa-public/user-role-utils"
import SettingMobileLayout from "@/page/SettingPage/layout/mobile"
import MobileSetting from "@/page/SettingPage/team/info/components/MobileSetting"
import Setting from "@/page/SettingPage/team/info/components/Setting"
import {
  SettingContextType,
  TeamSettingErrorMsg,
  TeamSettingFields,
} from "@/page/SettingPage/team/interface"
import { track } from "@/utils/mixpanelHelper"

const TeamSetting: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { teamIdentifier } = useParams()
  const { onClickLeaveTeam } = useOutletContext<SettingContextType>()
  const teamInfo = useSelector(getCurrentTeamInfo)
  const [loading, setLoading] = useState(false)
  const [errorMsg, _setErrorMsg] = useState<TeamSettingErrorMsg>({
    name: "",
    identifier: "",
  })
  const { message } = App.useApp()

  const [changeTeamConfig] = useChangeTeamConfigMutation()
  const settingFormProps = useForm<TeamSettingFields>({
    defaultValues: {
      name: teamInfo?.name,
      identifier: teamInfo?.identifier,
    },
  })

  useEffect(() => {
    if (teamInfo) {
      settingFormProps.reset({
        name: teamInfo.name,
        identifier: teamInfo.identifier,
      })
    }
  }, [settingFormProps, teamInfo])

  const formRef = useRef<HTMLFormElement>(null)
  const disableEdit = useMemo(() => {
    return teamInfo && isSmallThanTargetRole(USER_ROLE.ADMIN, teamInfo?.myRole)
  }, [teamInfo])
  const dispatch = useDispatch()

  const onSubmit: SubmitHandler<TeamSettingFields> = async (data) => {
    try {
      setLoading(true)
      await changeTeamConfig({
        data,
        teamID: teamInfo?.id as string,
      })
      message.success({
        content: t("team_setting.message.save_suc"),
      })
      dispatch(teamActions.updateCurrentTeamInfoReducer(data))
      if (data.identifier && data.identifier !== teamIdentifier) {
        navigate(`/setting/${data.identifier}/team-settings`)
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
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              teamInfo={teamInfo}
              onClickLeaveTeam={onClickLeaveTeam}
            />
          }
          mobilePage={
            <SettingMobileLayout>
              <MobileSetting
                ref={formRef}
                disabled={disableEdit}
                loading={loading}
                errorMsg={errorMsg}
                onSubmit={onSubmit}
              />
            </SettingMobileLayout>
          }
        />
      </FormProvider>
    </MixpanelTrackProvider>
  )
}

export default TeamSetting
