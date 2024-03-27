import { App, Button, Modal } from "antd"
import { FC, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getColor } from "@illa-public/color-scheme"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentTeamInfo,
  getTeamItems,
  teamActions,
  useRemoveTeamMemberByIDMutation,
} from "@illa-public/user-data"
import store from "@/redux/store"
import { setLocalTeamIdentifier } from "@/utils/auth"
import { EMPTY_TEAM_PATH, getChatPath } from "@/utils/routeHelper"
import DeleteTeamModal from "../DeleteTeamModal"
import { footerStyle, modalContentStyle, modalTitleStyle } from "./style"

interface LeaveTeamModalProps {
  visible: boolean
  onCancel: () => void
}

const LeaveTeamModal: FC<LeaveTeamModalProps> = (props) => {
  const { visible, onCancel } = props
  const { t } = useTranslation()
  const teamInfo = useSelector(getCurrentTeamInfo)!
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { track } = useContext(MixpanelTrackContext)
  const [removeTeamMemberByID] = useRemoveTeamMemberByIDMutation()
  const { message } = App.useApp()
  const dispatch = useDispatch()

  const leaveTeam = async () => {
    if (!teamInfo?.teamMemberID) return
    track?.(ILLA_MIXPANEL_EVENT_TYPE.CLICK, {
      element: "delete_modal_delete",
      parameter1:
        teamInfo.myRole === USER_ROLE.OWNER ? "delete_button" : undefined,
    })
    try {
      setLoading(true)
      await removeTeamMemberByID({
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
      setLoading(false)
    }
  }

  if (teamInfo.myRole === USER_ROLE.OWNER) {
    return <DeleteTeamModal visible={visible} onCancel={onCancel} />
  }

  return (
    <Modal
      open={visible}
      styles={{
        content: {
          padding: 24,
        },
        mask: {
          backgroundColor: getColor("white", "05"),
          backdropFilter: "blur(5px)",
        },
        footer: {
          margin: 0,
        },
      }}
      centered
      onCancel={onCancel}
      footer={false}
      closeIcon={false}
    >
      <div css={modalContentStyle}>
        <div css={modalTitleStyle}>{t("team_setting.leave_modal.title")}</div>
        <span> {t("team_setting.leave_modal.description")}</span>
        <div css={footerStyle}>
          <Button block onClick={onCancel}>
            {t("team_setting.delete_modal.cancel")}
          </Button>
          <Button
            block
            loading={loading}
            danger
            type="primary"
            onClick={leaveTeam}
          >
            {t("team_setting.leave_modal.leave")}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

LeaveTeamModal.displayName = "LeaveTeamModal"

export default LeaveTeamModal
