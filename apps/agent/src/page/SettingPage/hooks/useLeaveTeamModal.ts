import { App } from "antd"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
// import { USER_ROLE } from "@illa-public/public-types"
import {
  getTeamItems,
  teamActions,
  useRemoveTeamMemberByIDMutation,
} from "@illa-public/user-data"
import store from "@/redux/store"
import { setLocalTeamIdentifier } from "@/utils/auth"
import { EMPTY_TEAM_PATH, getChatPath } from "@/utils/routeHelper"
import { useGetCurrentTeamInfo } from "@/utils/team"

export const useLeaveTeamModal = () => {
  const [removeTeamMemberByID] = useRemoveTeamMemberByIDMutation()
  const { t } = useTranslation()
  const teamInfo = useGetCurrentTeamInfo()!
  const navigate = useNavigate()
  const { message, modal } = App.useApp()
  const dispatch = useDispatch()

  const leaveTeam = async () => {
    if (!teamInfo?.teamMemberID) return
    // track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
    //   element: "delete_modal_delete",
    //   parameter1:
    //     teamInfo.myRole === USER_ROLE.OWNER ? "delete_button" : undefined,
    // })
    try {
      // setLoading(true)
      removeTeamMemberByID({
        teamID: teamInfo.id,
        teamMemberID: teamInfo?.teamMemberID,
      }).unwrap()
      const teamItems = getTeamItems(store.getState()) ?? []
      const newTeamItems = teamItems.filter((team) => team.id !== teamInfo.id)
      if (Array.isArray(newTeamItems) && newTeamItems.length > 0) {
        setLocalTeamIdentifier(newTeamItems[0].identifier)
        dispatch(teamActions.updateCurrentIdReducer(newTeamItems[0].id))
        navigate(getChatPath(newTeamItems[0].identifier), {
          replace: true,
        })
      } else {
        navigate(EMPTY_TEAM_PATH, {
          replace: true,
        })
      }
    } catch (error) {
      message.error(t("team_setting.mes.leave_fail"))
    } finally {
      // setLoading(false)
    }
  }

  const showLeaveTeamModal = () => {
    modal.confirm({
      centered: true,
      title: t("team_setting.leave_modal.title"),
      content: t("team_setting.leave_modal.description"),
      onOk: leaveTeam,
    })
  }

  return {
    showLeaveTeamModal,
  }
}
