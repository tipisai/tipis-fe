import { App, Button, Modal } from "antd"
import { FC, useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getColor } from "@illa-public/color-scheme"
import {
  ILLA_MIXPANEL_EVENT_TYPE,
  MixpanelTrackContext,
} from "@illa-public/mixpanel-utils"
import { USER_ROLE } from "@illa-public/public-types"
import {
  getCurrentTeamIdentifier,
  getCurrentTeamInfo,
  useRemoveTeamMemberByIDMutation,
} from "@illa-public/user-data"
import store from "@/redux/store"
import { getExploreTipisPath } from "@/utils/routeHelper"
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
      })
      const currentIdentifier = getCurrentTeamIdentifier(store.getState())
      // TODO: WTF, empty teams
      // if (currentTeamItems.length === 0) {
      //   navigate("/")
      // }
      // navigate(tempRootPath(currentTeamItems[0].identifier), {
      //   replace: true,
      // })
      if (currentIdentifier) {
        navigate(getExploreTipisPath(currentIdentifier), {
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
