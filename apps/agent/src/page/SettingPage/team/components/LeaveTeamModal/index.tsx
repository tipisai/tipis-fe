import { App, Modal } from "antd"
import { FC, useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  teamActions,
  useRemoveTeamMemberByIDMutation,
} from "@illa-public/user-data"
import DeleteTeamModal from "../DeleteTeamModal"

interface LeaveTeamModalProps {
  visible: boolean
  onCancel: () => void
}

const LeaveTeamModal: FC<LeaveTeamModalProps> = (props) => {
  const { visible, onCancel } = props
  const { t } = useTranslation()
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { track } = useContext(MixpanelTrackContext)
  const [removeTeamMemberByID] = useRemoveTeamMemberByIDMutation()
  const { message } = App.useApp()

  const { userRole, teamMemberID } = useMemo(() => {
    return {
      userRole: teamInfo?.myRole,
      teamMemberID: teamInfo?.teamMemberID,
    }
  }, [teamInfo])

  const removeTeamMember = async () => {
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "delete_modal_delete",
      parameter1:
        teamInfo?.myRole === USER_ROLE.OWNER ? "delete_button" : undefined,
      team_id: teamInfo?.identifier || "-1",
    })
    try {
      teamMemberID &&
        (await removeTeamMemberByID({
          teamID: teamInfo?.id,
          teamMemberID,
        }))
      navigate("/workspace", { replace: true })
      dispatch(teamActions.deleteTeamInfoReducer())
    } catch (error) {
      message.error(t("team_setting.mes.leave_fail"))
    }
  }

  if (userRole === USER_ROLE.OWNER) {
    return <DeleteTeamModal visible={visible} onCancel={onCancel} />
  }

  return (
    <Modal
      title={t("team_setting.leave_modal.title")}
      okText={t("team_setting.leave_modal.leave")}
      onOk={removeTeamMember}
      open={visible}
      onCancel={onCancel}
    >
      {t("team_setting.leave_modal.description")}
    </Modal>
  )
}

LeaveTeamModal.displayName = "LeaveTeamModal"

export default LeaveTeamModal
